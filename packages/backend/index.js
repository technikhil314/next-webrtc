const fs = require('fs')
const path = require('path')
const cryptoRandomString = require("crypto-random-string");
const rooms = {
    // roomId: [
    //     {
    //         userId: 0,
    //         socket: socket
    //     }
    // ]
};
console.log(process.env.PORT);
const fastify = require('fastify')({
    logger: true,
    https: {
        key: fs.readFileSync(path.join(__dirname, 'https', 'domain.key')),
        cert: fs.readFileSync(path.join(__dirname, 'https', 'domain.crt')),
    }
})
fastify.register(require('fastify-websocket'))

fastify.get('/', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    let currentRoom = [];
    function handleConnect(serializedData) {
        const socket = connection.socket;
        const data = JSON.parse(serializedData);
        let currentRoomId = data.roomId, currentUserId;
        if (!currentRoomId) {
            currentRoomId = cryptoRandomString({ length: 10 })
            currentUserId = 0;
            rooms[currentRoomId] = [];
            currentRoom = rooms[currentRoomId];
            currentRoom.push(socket);
        } else if (!rooms[currentRoomId]) {
            rooms[currentRoomId] = [];
            currentUserId = 0;
        } else {
            currentRoom = rooms[currentRoomId];
            currentUserId = currentRoom.length;
        }
        currentRoom = rooms[currentRoomId];
        currentRoom.push(socket);
        socket.send(JSON.stringify({
            rtcContent: "connectSuccess",
            roomId: currentRoomId,
            userId: currentUserId
        }));
        return currentUserId;
    }

    function broadcastNewConnection(userId) {
        currentRoom.forEach((socket, index) => {
            console.log(index, userId);
            index !== userId && socket.send(JSON.stringify({
                rtcContent: "newPeer",
                peerId: userId
            }))
        });
    }

    connection.socket.on('message', (serializedData) => {
        fastify.log.info(serializedData);
        const { type, ...rest } = JSON.parse(serializedData);
        if (type === "message") {
            console.log(`from ${rest.by} to ${rest.to} of type ${type}`)
        }
        switch (type) {
            case 'connect':
                const userId = handleConnect(serializedData);
                broadcastNewConnection(userId);
                break;
            case "message":
                const destinationUser = currentRoom[rest.to];
                destinationUser.send(serializedData);
                break;
        }
    })
    connection.socket.on('close', () => {
        const disconnectedUserId = currentRoom.indexOf(connection.socket);
        fastify.log.info({
            msg: `Client disconnected ${disconnectedUserId}`,
        })
        currentRoom.forEach((socket, index) => {
            index !== disconnectedUserId && socket.send(JSON.stringify({
                rtcContent: "deletedPeer",
                peerId: disconnectedUserId
            }))
        });
    })
})
// Run the server!
fastify.listen(process.env.PORT || 4000, '0.0.0.0', function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})
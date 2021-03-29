const fs = require("fs");
const path = require("path");
const cryptoRandomString = require("crypto-random-string");
let rooms = {};
const fastifyOptions = {
  logger: true,
};
if (process.env.NODE_ENV !== "production") {
  fastifyOptions.https = {
    key: fs.readFileSync(path.join(__dirname, "https", "domain.key")),
    cert: fs.readFileSync(path.join(__dirname, "https", "domain.crt")),
  };
}
const fastify = require("fastify")(fastifyOptions);
fastify.register(require("fastify-websocket"));

fastify.get("/", { websocket: true }, (
  connection /* SocketStream */,
  req /* FastifyRequest */,
  reply
) => {
  let currentRoom = [];
  function handleConnect(serializedData) {
    const socket = connection.socket;
    const data = JSON.parse(serializedData);
    let currentRoomId = data.roomId,
      currentUserId;
    if (!currentRoomId) {
      currentRoomId = cryptoRandomString({ length: 10 });
      rooms[currentRoomId] = [];
      currentRoom = rooms[currentRoomId];
    } else if (!rooms[currentRoomId]) {
      rooms[currentRoomId] = [];
    } else {
      currentRoom = rooms[currentRoomId];
    }
    currentRoom = rooms[currentRoomId];
    currentRoom.push(socket);
    currentUserId = currentRoom.length - 1;
    socket.send(
      JSON.stringify({
        rtcContent: "connectSuccess",
        roomId: currentRoomId,
        userId: currentUserId,
      })
    );
    return currentUserId;
  }

  function broadcastNewConnection(userId, userName) {
    console.info("newPeer", userId);
    currentRoom.forEach((socket, index) => {
      index !== userId &&
        socket.send(
          JSON.stringify({
            rtcContent: "newPeer",
            by: userId,
            userName: userName,
          })
        );
    });
  }

  connection.socket.on("message", (serializedData) => {
    fastify.log.info(serializedData);
    const { type, ...rest } = JSON.parse(serializedData);
    if (type === "message") {
      console.info(
        `from ${rest.by} to ${rest.to} of type ${rest.rtcContent || type}`
      );
    }
    switch (type) {
      case "connect": {
        const userId = handleConnect(serializedData);
        broadcastNewConnection(userId, rest.userName);
        break;
      }
      case "message": {
        const destinationUser = currentRoom[rest.to];
        destinationUser.send(serializedData);
        break;
      }
    }
  });
  connection.socket.on("close", () => {
    const disconnectedUserId = currentRoom.indexOf(connection.socket);
    fastify.log.info({
      msg: `Client disconnected ${disconnectedUserId}`,
    });
    currentRoom.forEach((socket, index) => {
      index !== disconnectedUserId &&
        socket.send(
          JSON.stringify({
            rtcContent: "deletedPeer",
            peerId: disconnectedUserId,
          })
        );
    });
  });
});
// Run the server!
fastify.listen(process.env.PORT || 4000, "0.0.0.0", function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});

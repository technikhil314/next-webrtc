var exampleSocket = new WebSocket("wss://localhost:3000/")
exampleSocket.onopen = function (event) {
    exampleSocket.send(JSON.stringify({ type: "connect" }));
};
exampleSocket.onmessage = function (event) {
    console.log(event.data);
}

// setTimeout(() => {
//     exampleSocket.close();
// }, 5000)
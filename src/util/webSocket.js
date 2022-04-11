export function socketOnOpen(socket, payload) {
  console.log("onopen");

  socket.onopen = () => {
    socket.send(JSON.stringify(payload));
  };
}
export function socketOnMessage(socket) {
  console.log("payload");
  socket.onmessage = function (event) {
    const json = JSON.parse(event.data);
    try {
      if ((json.event = "data")) {
        console.log(json.data.bids.slice(0, 5));
      }
    } catch (err) {
      console.log(err);
    }
  };
}

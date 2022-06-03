import useWebSocket from "react-use-websocket";
import config from "config";

// In functional React component

// This can also be an async getter function. See notes below on Async Urls.
let host = "ws:";
try {
  const loc = window.location;
  if (loc.protocol === "https:") {
    host = "wss:";
  }
} catch {}
const socketUrl = `${host}//${config.WEB_SOKET}/ws`;

const {
  sendMessage,
  sendJsonMessage,
  lastMessage,
  lastJsonMessage,
  readyState,
  getWebSocket,
} = useWebSocket(socketUrl, {
  onOpen: () => {
    console.log("opened");
    JSON.stringify({ Token: localStorage.getItem("currentUser") });
  },
  //Will attempt to reconnect on all close events, such as server shutting down
  shouldReconnect: (closeEvent) => true,
});

export { sendMessage, lastMessage, readyState, getWebSocket };

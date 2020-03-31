import Connection from "./ws/connection";
const url = "wss://echo.websocket.org";
// const url = "wss://ya.ru";
const connection = new Connection(url);
console.log("connection", connection);

connection.addDataListener(frame => {
  console.info("frame", frame);
});

connection.addStateListener(state => {
  console.info("state", state);
});

// tslint:disable-next-line
window["c"] = connection;

import Connection, { CONNECTION_STATE } from "./ws/connection";
import ConnectionMaster from "./ws/connection-master";
const url = "wss://echo.websocket.org";
// const url = "wss://ya.ru";

function creator(): Promise<Connection> {
  return new Promise(resolve => {
    const connection = new Connection(url);

    connection.addStateListener(state => {
      if (state === CONNECTION_STATE.OPENED) {
        resolve(connection);
      }

      console.info("state", state);
    });
  });
}

const master = new ConnectionMaster(creator);

master.addDataListener(frame => {
  console.info("frame", frame);
});

// tslint:disable-next-line
window["m"] = master;

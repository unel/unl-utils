import Connection, { CONNECTION_STATE } from "./connection";

type CreateConnectionFn = (attemptNumber: number) => Promise<Connection>;
type JsonDataListener = (data: object) => void;

class ConnectionMaster {
  private creator: CreateConnectionFn;
  private connection?: Connection;
  private dataListeners: Set<JsonDataListener> = new Set();

  constructor(creator: CreateConnectionFn) {
    this.creator = creator;

    this.createConnection();
  }

  send(jsonData: object) {
    if (!this.connection) {
      throw new Error("Can't send data without connection");
      // TODO: put into messages queue
    }
    try {
      const data = JSON.stringify(jsonData);
      this.connection.send(data);
    } catch (e) {
      console.warn("Can't send data", jsonData, e);
    }
  }

  addDataListener(listener: JsonDataListener) {
    this.dataListeners.add(listener);
  }

  private createConnection(attemptNumber = 1) {
    console.info("Creating new connection..");
    return this.creator(attemptNumber)
      .then(connection => {
        console.info("Connection created..", connection);

        connection.addStateListener(state => {
          if (state === CONNECTION_STATE.DESTROYED) {
            this.onConnectionDestroyed(connection);
          }
        });

        connection.addDataListener(data => {
          this.onConnectionData(connection, data);
        });

        this.connection = connection;

        return connection;
      })
      .catch(e => {
        console.warn("Failed to create connection:", e);

        return this.createConnection(attemptNumber + 1);
      });
  }

  private onConnectionDestroyed(connection) {
    console.log("connection destroyed", connection);
    this.connection = undefined;
    this.createConnection();
  }

  private onConnectionData(connection, data) {
    try {
      const jsonData = JSON.parse(data);
      this.notifyDataListeners(jsonData);
    } catch (e) {
      console.warn("Can't process data", e);
    }
  }

  private notifyDataListeners(jsonData) {
    for (const listener of this.dataListeners) {
      try {
        listener(jsonData);
      } catch (e) {
        console.warn("Can't notify data listener", e);
      }
    }
  }
}

export default ConnectionMaster;

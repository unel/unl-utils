type DataListener = (frame: any) => void;
type StateListener = (state: CONNECTION_STATE) => void;
enum CONNECTION_STATE {
  INITIALISING = "INITIALISING",
  OPENED = "OPENED",
  CLOSED = "CLOSED",
  ERROR_OCCURED = "ERROR_OCCURED",
  DESTROYED = "DESTROYED"
}
class Connection {
  url: string;
  state: CONNECTION_STATE = CONNECTION_STATE.INITIALISING;

  private dataListeners: Set<DataListener> = new Set();
  private stateListeners: Set<StateListener> = new Set();
  private ws?: WebSocket;

  constructor(url: string) {
    this.url = url;

    try {
      this.ws = new WebSocket(url);
      this.ws.onopen = this.onWebsocketOpen.bind(this);
      this.ws.onmessage = this.onWebsocketMessage.bind(this);
      this.ws.onerror = this.onWebsocketError.bind(this);
      this.ws.onclose = this.onWebsocketClose.bind(this);
    } catch (e) {
      this.processError(e);
    }
  }

  addDataListener(listener: DataListener) {
    this.dataListeners.add(listener);
  }

  addStateListener(listener: StateListener) {
    this.stateListeners.add(listener);
  }

  send(data: any) {
    if (this.state !== CONNECTION_STATE.OPENED) {
      throw new Error(`Can't send data in state ${this.state}`);
    }

    if (!this.ws) {
      throw new Error("Can't send data without initialised websocket");
    }

    this.ws.send(data);
  }

  onWebsocketOpen(event: Event) {
    this.setState(CONNECTION_STATE.OPENED);
  }

  onWebsocketMessage(event: MessageEvent) {
    this.notifyDataListeners(event.data);
  }

  onWebsocketError(event: Event) {
    this.processError(new Error("Websocket error"));
  }

  onWebsocketClose(event: Event) {
    this.setState(CONNECTION_STATE.CLOSED);
    this.destroy();
  }

  setState(connectionState: CONNECTION_STATE) {
    if (this.state === CONNECTION_STATE.DESTROYED) {
      console.warn("Attempt to set state in destroyed connection");
      return;
    }

    if (this.state === connectionState) {
      return;
    }

    this.state = connectionState;
    this.notifyStateListeners(this.state);
  }

  private processError(e: Error) {
    console.warn("Error occured", e);
    this.setState(CONNECTION_STATE.ERROR_OCCURED);
    this.destroy();
  }

  private notifyDataListeners(data: any): void {
    for (const listener of this.dataListeners) {
      try {
        listener(data);
      } catch (e) {
        console.warn("Error occured when notifying data listener", e);
      }
    }
  }

  private notifyStateListeners(state: CONNECTION_STATE): void {
    for (const listener of this.stateListeners) {
      try {
        listener(state);
      } catch (e) {
        console.warn("Error occured when notifying state listener", e);
      }
    }
  }

  private clear() {}

  destroy() {
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;

      this.ws.close();
      this.ws = undefined;
    }

    this.setState(CONNECTION_STATE.DESTROYED);
    this.dataListeners.clear();
    this.stateListeners.clear();

    console.warn("connection was destroyed");
  }
}

export default Connection;

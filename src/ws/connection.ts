type DataListener = (frame: any) => void;

class Connection {
	private dataListeners: Set<DataListener> = new Set();

	addDataListener(listener: DataListener) {
		this.dataListeners.add(listener);
	}

	private notify(data: any): void {
		for (const listener of this.dataListeners) {
			try {
				listener(data);
			} catch (e) {
				console.warn("Error occured when notifying data listener", e);
			}
		}
	}

	destroy() {
		console.warn("connection was destroyed");
	}
}

export default Connection;

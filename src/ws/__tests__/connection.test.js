import Connection from "../connection";

describe("Connection tests", () => {
	let connection;
	beforeEach(() => {
		connection = new Connection();
	});

	afterEach(() => {
		connection.destroy();
		connection = undefined;
	});

	describe("Notification", () => {
		test(".notify should call listeners with forwarded data", () => {
			const dataListener = jest.fn().mockName("dataListener");
			const testData = {};
			connection.addDataListener(dataListener);
			connection.notify(testData);

			expect(dataListener).toHaveBeenCalledTimes(1);
			expect(dataListener).toHaveBeenCalledWith(testData);
		});
	});
});

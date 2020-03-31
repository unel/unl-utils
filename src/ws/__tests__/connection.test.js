import Connection from "../connection";

describe("Connection tests", () => {
	describe("Notification", () => {
		test(".notify should call listeners with forwarded data", () => {
			const connection = new Connection();

			const dataListener = jest.fn().mockName("dataListener");
			const testData = {};
			connection.addDataListener(dataListener);
			connection.notify(testData);

			expect(dataListener).toHaveBeenCalledTimes(1);
			expect(dataListener).toHaveBeenCalledWith(testData);
		});
	});
});

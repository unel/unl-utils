import Connection from "../connection";

describe("Connection tests", () => {
  let connection: Connection;
  const wsUrl = "wss://echo.websocket.org";
  beforeEach(() => {
    connection = new Connection(wsUrl);
  });

  afterEach(() => {
    connection.destroy();
  });

  describe("Notification", () => {
    test("notifyDataListeners should call data listeners with forwarded data", () => {
      const dataListener = jest.fn().mockName("dataListener");
      const testData = {};
      connection.addDataListener(dataListener);

      // tslint:disable-next-line
      connection.notifyDataListeners(testData);

      expect(dataListener).toHaveBeenCalledTimes(1);
      expect(dataListener).toHaveBeenCalledWith(testData);
    });
  });
});

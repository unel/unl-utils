import Connection from "./ws/connection";

const connection = new Connection();
connection.addDataListener(frame => {
	console.log("connection frame arrived:", frame);
});

connection.notify({});

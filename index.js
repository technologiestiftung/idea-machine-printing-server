import bluetoothSerialMonitors from "./services/bluetooth/bluetooth.js";
import server from "./services/rest/rest.js";
import { webSocketServer } from "./services/socket/socket.js";
import "./services/browser/browser.js";

process.on("SIGINT", closeEverything);

process.on("SIGTERM", closeEverything);

function closeEverything() {
	bluetoothSerialMonitors.forEach((monitor) => monitor.kill());
	server.close();
	webSocketServer.clients.forEach((client) => client.close());
	webSocketServer.close();
}

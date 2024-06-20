import bluetoothSerialMonitors from "./services/bluetooth/bluetooth.js";
import server from "./services/rest/rest.js";
import { webSocketServer } from "./services/socket/socket.js";
import { gpioProcess } from "./services/gpio/gpio.js";
import "./services/print/print.js";
import "./services/browser/browser.js";

process.on("SIGINT", () => closeEverything(1));

process.on("SIGTERM", () => closeEverything(0));

function closeEverything(eventId) {
	bluetoothSerialMonitors.forEach((monitor) => monitor.kill());
	server.close();
	webSocketServer.clients.forEach((client) => client.close());
	webSocketServer.close();
	gpioProcess.kill();

	process.exit(eventId)
}

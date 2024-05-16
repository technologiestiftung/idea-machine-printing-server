import bluetoothSerialMonitors from "./services/bluetooth/bluetooth.js";
import "./services/browser/browser.js";
import server from "./services/rest/rest.js";
import "./services/state/state.js";

process.on("SIGINT", () => {
	bluetoothSerialMonitors.forEach((monitor) => monitor.kill("SIGINT"));
	server.close();
});

process.on("SIGTERM", () => {
	bluetoothSerialMonitors.forEach((monitor) => monitor.kill("SIGTERM"));
	server.close();
});

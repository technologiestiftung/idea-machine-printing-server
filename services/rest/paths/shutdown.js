import { exec } from "child_process";

export function handleShutdown(response) {
	response.end(JSON.stringify({ message: "Raspi is being shut down ..." }));
	exec("sudo shutdown -h now");
}

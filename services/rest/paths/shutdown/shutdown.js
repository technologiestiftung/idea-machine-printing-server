import { exec } from "child_process";

/**
 * Handle the shutdown of the Raspi
 * @param {ServerResponse} response
 */
export function handleShutdown(response) {
	response.end(JSON.stringify({ message: "Raspi is being shut down ..." }));
	exec("sudo shutdown -h now");
}

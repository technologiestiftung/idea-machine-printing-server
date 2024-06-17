import childProcess from "child_process";

export const gpioProcess = childProcess.spawn(
	'python3', ['./services/gpio/gpio.py']
);

import childProcess from "child_process";
import {
	setDiceSide,
	getDices,
	setDiceConnectionStatus,
} from "../state/state.js";

const diceAMacAddress = process.env.DICE_A_MAC_ADDRESS;
const rfcommA = "1";
const diceBMacAddress = process.env.DICE_B_MAC_ADDRESS;
const rfcommB = "2";
const diceCMacAddress = process.env.DICE_C_MAC_ADDRESS;
const rfcommC = "3";

const dices = [
	{ diceId: "A", diceMacAddress: diceAMacAddress, rfcomm: rfcommA },
	{ diceId: "B", diceMacAddress: diceBMacAddress, rfcomm: rfcommB },
	{ diceId: "C", diceMacAddress: diceCMacAddress, rfcomm: rfcommC },
];

const bluetoothSerialMonitors = dices.map((dice) =>
	createBluetoothSerialMonitor(dice),
);

function createBluetoothSerialMonitor({ diceId, diceMacAddress, rfcomm }) {
	let isRestarting = false;

	console.log(
		`createBluetoothSerialMonitor, ${diceId}, ${diceMacAddress}, ${rfcomm}`,
	);

	bindDiceToRfcomm(diceMacAddress, rfcomm);

	let picocom = childProcess.spawn("picocom", [
		`/dev/rfcomm${rfcomm}`,
		"-b",
		"115200",
	]);

	const initial = setTimeout(
		() => setDiceConnectionStatus({ [diceId]: "connected" }),
		5000,
	);

	picocom.stdout.on("data", (data) => {
		setDiceSide(data);
		console.log(getDices());
	});

	picocom.stderr.on("data", (data) => {
		console.error(`stderr: ${data}`);

		if (isRestarting) {
			return;
		}

		isRestarting = true;

		clearTimeout(initial);
		cleanup({ diceId, diceMacAddress, rfcomm });

		console.log(
			`picocom for dice ${diceId} threw an error. Retrying in 10 seconds..`,
		);

		setTimeout(
			() =>
				(picocom = createBluetoothSerialMonitor({
					diceId,
					diceMacAddress,
					rfcomm,
				})),
			30000,
		);
	});

	picocom.on("exit", async () => cleanup({ diceId, diceMacAddress, rfcomm }));

	return picocom;
}

function cleanup({ diceId, diceMacAddress, rfcomm }) {
	releaseDiceToRfcomm(diceMacAddress, rfcomm);
	setDiceConnectionStatus({ [diceId]: "disconnected" });
}

function bindDiceToRfcomm(diceMacAddress, rfcomm) {
	const stdout = childProcess.execSync(
		`sudo rfcomm bind ${rfcomm} ${diceMacAddress}`,
	);
	console.log(
		`bound dice ${diceMacAddress} to rfcomm${rfcomm}, stdout:`,
		stdout.toString(),
	);
}

function releaseDiceToRfcomm(diceMacAddress, rfcomm) {
	const stdout = childProcess.execSync(`sudo rfcomm release rfcomm${rfcomm}`);
	console.log(
		`released dice ${diceMacAddress} from rfcomm${rfcomm}, stdout:`,
		stdout.toString(),
	);
}

export default bluetoothSerialMonitors;

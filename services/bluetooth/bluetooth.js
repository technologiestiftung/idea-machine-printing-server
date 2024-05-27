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

const bluetoothSerialMonitors = dices.map(
	({ diceId, diceMacAddress, rfcomm }) => {
		const stdout = childProcess.execSync(
			`sudo rfcomm bind ${rfcomm} ${diceMacAddress}`,
		);
		console.log(
			`bound dice ${diceMacAddress} to rfcomm${rfcomm}, stdout:`,
			stdout.toString(),
		);

		const picocom = childProcess.spawn("picocom", [
			`/dev/rfcomm${rfcomm}`,
			"-b",
			"115200",
		]);

		setDiceConnectionStatus({ [diceId]: "connected" });

		picocom.stdout.on("data", (data) => {
			setDiceSide(data);
			console.log(getDices());
		});

		picocom.stderr.on("data", (data) => console.error(`stderr: ${data}`));

		picocom.on("exit", async () => {
			const stdout = childProcess.execSync(
				`sudo rfcomm release rfcomm${rfcomm}`,
			);
			console.log(
				`released dice ${diceMacAddress} from rfcomm${rfcomm}, stdout:`,
				stdout.toString(),
			);
			setDiceConnectionStatus({ [diceId]: "disconnected" });
		});

		return picocom;
	},
);

export default bluetoothSerialMonitors;

import childProcess from "child_process";
import { setDiceSide, getDices } from "../state/state.js";

const diceA = process.env.DICE_A_MAC_ADDRESS;
const rfcommA = "1";
const diceB = process.env.DICE_B_MAC_ADDRESS;
const rfcommB = "2";

const diceC = process.env.DICE_C_MAC_ADDRESS;
const rfcommC = "3";

const dices = [
	{ dice: diceA, rfcomm: rfcommA },
	{ dice: diceB, rfcomm: rfcommB },
	{ dice: diceC, rfcomm: rfcommC },
];

const bluetoothSerialMonitors = dices.map(({ dice, rfcomm }) => {
	const stdout = childProcess.execSync(`sudo rfcomm bind ${rfcomm} ${dice}`);
	console.log(
		`bound dice ${dice} to rfcomm${rfcomm}, stdout:`,
		stdout.toString(),
	);

	const picocom = childProcess.spawn("picocom", [
		`/dev/rfcomm${rfcomm}`,
		"-b",
		"115200",
	]);

	picocom.stdout.on("data", (data) => {
		setDiceSide(data);
		console.log(getDices());
	});

	picocom.stderr.on("data", (data) => console.error(`stderr: ${data}`));

	picocom.on("exit", async () => {
		const stdout = childProcess.execSync(`sudo rfcomm release rfcomm${rfcomm}`);
		console.log(
			`released dice ${dice} from rfcomm${rfcomm}, stdout:`,
			stdout.toString(),
		);
	});

	return picocom;
});

export default bluetoothSerialMonitors;

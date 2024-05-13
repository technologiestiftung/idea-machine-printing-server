import fs from "node:fs";
import labelsJson from "./labels.json" with { type: "json" };
let labels = labelsJson;

const sides = [
	"A1",
	"A2",
	"A3",
	"A4",
	"A5",
	"A6",
	"B1",
	"B2",
	"B3",
	"B4",
	"B5",
	"B6",
	"C1",
	"C2",
	"C3",
	"C4",
	"C5",
	"C6",
];

const dices = {
	A: "1",
	B: "1",
	C: "1",
};

function parseDiceSide(input) {
	return sides.filter((side) => input.includes(side))[0];
}

export function setDiceSide(input) {
	const diceSide = parseDiceSide(input);

	if (!diceSide) {
		return;
	}

	const dice = diceSide[0];
	const side = diceSide[1];

	dices[dice] = side;
}

export function getDices() {
	return dices;
}

export function getLabels() {
	return labels;
}

export function setLabels(newLabels) {
	labels = newLabels;

	try {
		fs.writeFileSync("./services/state/labels.json", JSON.stringify(labels));
	} catch (error) {
		console.error(error);
	}
}

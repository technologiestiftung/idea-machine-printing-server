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
	A: "6",
	B: "6",
	C: "6",
};

function parseDiceSide(input) {
	return sides.filter((side) => input.includes(side))[0];
}

export function setDiceSide(input) {
	const diceSide = parseDiceSide(input);

	if (!diceSide) {
		return;
	}

	const [dice, side] = diceSide;

	dices[dice] = side;
}

export function getDices() {
	return dices;
}

export function getLabels() {
	return labels;
}

function getRandomElementFromArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}

export function replaceWildcards(label) {
	switch (label) {
		case "such dir selbst ein Medium aus":
			return "Joker (?)";
		case "wähle selbst eine Gruppe an Menschen":
			return "Joker (?)";
		case "wähle selbst eine Kategorie":
			return "Joker (?)";
		default:
			return label;
	}
}

function getLabelFromCSV(label) {
	const labels = label.split(",");

	const randomLabel = getRandomElementFromArray(labels);

	return randomLabel.trim();
}

export function getLabelsForCurrentSides() {
	const focusGroupSide = `A${dices.A}`;
	const topicSide = `B${dices.B}`;
	const mediumSide = `C${dices.C}`;

	let focusGroup = labels[focusGroupSide];
	if (focusGroup.includes(",")) {
		focusGroup = getLabelFromCSV(focusGroup);
	}

	let topic = labels[topicSide];
	if (topic.includes(",")) {
		topic = getLabelFromCSV(topic);
	}

	let medium = labels[mediumSide];
	if (medium.includes(",")) {
		medium = getLabelFromCSV(medium);
	}

	return {
		focusGroup,
		topic,
		medium,
	};
}

export function setLabels(newLabels) {
	labels = newLabels;

	try {
		fs.writeFileSync(
			"./services/state/labels.json",
			JSON.stringify(labels, null, 2),
		);
	} catch (error) {
		console.error(error);
	}
}

import fs from "node:fs";
import labelsJson from "./labels.json" with { type: "json" };
import { broadcast } from "../socket/socket.js";
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
	A: {
		side: null,
		status: "disconnected",
	},
	B: {
		side: null,
		status: "disconnected",
	},
	C: {
		side: null,
		status: "disconnected",
	},
};

function setDices(diceId, diceState) {
	dices[diceId] = diceState;

	broadcast(JSON.stringify({ dices }));
}

export function setDiceConnectionStatus(input) {
	for (const [diceId, diceConnectionStatus] of Object.entries(input)) {
		if (diceConnectionStatus === "connected") {
			setDices(diceId, {
				side: null,
				status: "connected",
			});
		}

		if (diceConnectionStatus === "disconnected") {
			setDices(diceId, {
				side: null,
				status: "disconnected",
			});
		}
	}
}

export function getDicesAsJson() {
	return JSON.stringify({ dices });
}

function parseDiceSide(input) {
	return sides.filter((side) => input.includes(side))[0];
}

export function setDiceSide(input) {
	const diceIdAndSide = parseDiceSide(input);

	if (!diceIdAndSide) {
		return;
	}

	const [diceId, diceSide] = diceIdAndSide;

	setDices(diceId, { ...dices[diceId], side: diceSide });
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
	const focusGroupSide = `A${dices.A.side}`;
	const topicSide = `B${dices.B.side}`;
	const mediumSide = `C${dices.C.side}`;

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

import { getLabels, getLabelsForSides } from "../../../state/state.js";
import { generateIdea } from "../../idea-generation/idea-generation.js";
import {
	MIN_AMOUNT_OF_PREGENERATED_IDEAS,
	strategies,
} from "../../idea-generation/constants.js";

/**
 * Handles the pregenerate endpoint
 * @param {ServerResponse} response
 * @returns {Promise<void>}
 */
export async function handlePregenerate(response) {
	response.statusCode = 200;
	/**
	 * This promise is not awaited by design, so it runs in the background
	 */
	pregenerate();
	response.end(JSON.stringify({ message: "ok" }));
}

/**
 * Pregenerates a min amount of ideas for all
 * possible combinations of the dice sides
 * @returns {Promise<void>}
 */
async function pregenerate() {
	const labels = getLabels();

	const { ASides, BSides, CSides } = getSidesByLabels(labels);

	const total =
		MIN_AMOUNT_OF_PREGENERATED_IDEAS *
		ASides.length *
		BSides.length *
		CSides.length;
	let counter = 1;
	for (
		let amountOfGeneratedIdeas = 0;
		amountOfGeneratedIdeas < MIN_AMOUNT_OF_PREGENERATED_IDEAS;
		amountOfGeneratedIdeas++
	) {
		await generateIdeas({ ASides, BSides, CSides, counter, total });
	}
}

/**
 * Returns the sides of the dice by their labels
 * @param labels
 * @returns {{ASides: string[], BSides: string[], CSides: string[]}}
 */
function getSidesByLabels(labels) {
	const ASides = [];
	const BSides = [];
	const CSides = [];

	/**
	 * temporary comment. This will be re-added for once we are ready for pregeneration
	 */
	// for (const id in labels) {
	// 	if (id.includes("A")) {
	// 		ASides.push(id);
	// 	}
	//
	// 	if (id.includes("B")) {
	// 		BSides.push(id);
	// 	}
	//
	// 	if (id.includes("C")) {
	// 		CSides.push(id);
	// 	}
	// }

	ASides.push("A6");
	BSides.push("B6");
	CSides.push("C6");

	return { ASides, BSides, CSides };
}

/**
 * Generates ideas for all possible combinations of the dice sides
 * @param ASides
 * @param BSides
 * @param CSides
 * @param counter
 * @param total
 * @returns {Promise<void>}
 */
async function generateIdeas({ ASides, BSides, CSides, counter, total }) {
	for (const A of ASides) {
		for (const B of BSides) {
			for (const C of CSides) {
				console.log(`pregenerating ${counter}/${total}`);

				const { focusGroup, topic, medium } = getLabelsForSides({ A, B, C });
				await generateIdea({
					focusGroup,
					topic,
					medium,
					strategy: strategies.pregenerate,
				});

				counter = counter + 1;
			}
		}
	}
}

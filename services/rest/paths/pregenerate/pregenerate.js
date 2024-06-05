import { getLabels, getLabelsForSides } from "../../../state/state.js";
import { generateIdea } from "../../idea-generation/idea-generation.js";
import { strategies } from "../../idea-generation/constants.js";

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
 * Pregenerates ideas for all possible combinations of the dice sides
 * @returns {Promise<void>}
 */
async function pregenerate() {
	const labels = getLabels();

	const { ASides, BSides, CSides } = getSidesByLabels(labels);

	const total = ASides.length * BSides.length * CSides.length;
	let i = 1;
	for (const A of ASides) {
		for (const B of BSides) {
			for (const C of CSides) {
				console.log(`pregenerating ${i}/${total}`);

				const { focusGroup, topic, medium } = getLabelsForSides({ A, B, C });
				await generateIdea({
					focusGroup,
					topic,
					medium,
					strategy: strategies.pregenerate,
				});

				i = i + 1;
			}
		}
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

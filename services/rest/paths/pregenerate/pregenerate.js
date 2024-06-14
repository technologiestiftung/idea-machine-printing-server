import {
	getAllLabelsForSides,
	getLabels,
	getLabelsForSides,
} from "../../../state/state.js";
import { generateIdea } from "../../idea-generation/idea-generation.js";
import {
	MIN_AMOUNT_OF_PREGENERATED_IDEAS,
	strategies,
} from "../../idea-generation/constants.js";
import { supabase } from "../../supabase.js";

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
	const args = { ASides, BSides, CSides, counter: 1, total };
	for (
		let amountOfGeneratedIdeas = 0;
		amountOfGeneratedIdeas < MIN_AMOUNT_OF_PREGENERATED_IDEAS;
		amountOfGeneratedIdeas++
	) {
		await generateIdeas(args);
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

	for (const id in labels) {
		if (id.includes("A")) {
			ASides.push(id);
		}

		if (id.includes("B")) {
			BSides.push(id);
		}

		if (id.includes("C")) {
			CSides.push(id);
		}
	}

	/**
	 * the code below can be used for debugging purposes
	 */
	// ASides.push("A6");
	// BSides.push("B6");
	// CSides.push("C6");

	return { ASides, BSides, CSides };
}

/**
 * Generates ideas for all possible combinations of the dice sides
 * @param {{ ASides: string[], BSides: string[], CSides: string[], counter: number, total: number }} args
 * @returns {Promise<void>}
 */
async function generateIdeas(args) {
	const { ASides, BSides, CSides, total } = args;

	for (const A of ASides) {
		for (const B of BSides) {
			for (const C of CSides) {
				console.log(`pregenerating ${args.counter}/${total}, ${A}, ${B}, ${C}`);
				args.counter = args.counter + 1;

				if (await hasEnoughIdeas({ A, B, C })) {
					console.log(`has enough ideas, skipping pregeneration`);
					continue;
				}

				const { focusGroup, topic, medium } = getLabelsForSides({ A, B, C });
				await generateIdea({
					focusGroup,
					topic,
					medium,
					strategy: strategies.pregenerate,
				});
			}
		}
	}
}

async function hasEnoughIdeas({ A, B, C }) {
	const { focusGroup, topic, medium } = getAllLabelsForSides({ A, B, C });

	const { data, error } = await supabase
		.from("pregenerated_ideas")
		.select("*")
		.in("focus_group", focusGroup)
		.in("topic", topic)
		.in("medium", medium);

	if (error) {
		throw error;
	}

	if (data.length < MIN_AMOUNT_OF_PREGENERATED_IDEAS) {
		return false;
	}

	return true;
}

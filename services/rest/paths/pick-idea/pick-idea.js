import {
	getAllLabelsForCurrentSides,
	getLabelsForCurrentSides,
} from "../../../state/state.js";
import { supabase } from "../../../supabase/supabase.js";
import { generateIdea } from "../../idea-generation/idea-generation.js";
import {
	MIN_AMOUNT_OF_PREGENERATED_IDEAS,
	strategies,
} from "../../idea-generation/constants.js";

/**
 * @typedef dbIdea
 * @property {string} idea
 * @property {string} focus_group
 * @property {string} medium
 * @property {string} topic
 * @property {string} created_at
 * @property {string} id
 * @property {string} illustration_url
 * @property {string} postcard_url
 */

/**
 * Flag to prevent high idea picking frequency
 * @type {boolean}
 */
let isThrottling = false;

/**
 * Handles the pick-idea endpoint.
 * @param {ServerResponse} response
 */
export async function handlePickIdea(response) {
	if (isThrottling) {
		response.end(JSON.stringify({ message: "throttling timeout not over" }));
		return;
	}

	isThrottling = true;

	const { idea, error } = await pickIdea();

	response.end(JSON.stringify({ idea, error }));

	setTimeout(() => {
		isThrottling = false;
	}, 5000);
}

/**
 * This will pick an idea from the pregenerated ideas
 * and move it to the idea (=history) table.
 * @returns {Promise<{error: string}|{idea: dbIdea}|{idea:Idea}>}
 */
async function pickIdea() {
	const { focusGroup, topic, medium } = getAllLabelsForCurrentSides();

	if (!focusGroup || !topic || !medium) {
		const errorMessage = `Some dices have not set a side yet: ${JSON.stringify({focusGroup, topic, medium})}`;
		console.error(errorMessage);
		return { error: errorMessage}
	}

	const { data, error } = await supabase
		.from("pregenerated_ideas")
		.select("*")
		.in("focus_group", focusGroup)
		.in("topic", topic)
		.in("medium", medium)
		.order("created_at", { ascending: true });

	if (error) {
		return { error: error.message };
	}

	if (data.length === 0) {
		const { focusGroup, topic, medium } = getLabelsForCurrentSides();

		const idea = await generateIdea({
			focusGroup,
			medium,
			topic,
			strategy: strategies.realtime,
		});

		return { idea };
	}

	const pickedIdea = /** @type {dbIdea} */ data[0];

	console.log("Picked idea", pickedIdea);

	await supabase.from("pregenerated_ideas").delete().eq("id", pickedIdea.id);

	delete pickedIdea.id;
	delete pickedIdea.created_at;

	await supabase.from("ideas").insert([pickedIdea]);

	/**
	 * this promise is not awaited by design, so it runs in the background
	 */
	regenerate();

	return {
		idea: pickedIdea,
	};
}

/**
 * Flag to prevent multiple regenerations at once
 * @type {boolean}
 */
let isRegenerating = false;

/**
 * Regenerates an idea for the current dice sides
 * @returns {Promise<void>}
 */
export async function regenerate() {
	if (isRegenerating) {
		return;
	}
	isRegenerating = true;

	console.time("regeneration");

	const { focusGroup, medium, topic } = getLabelsForCurrentSides();

	await generateIdea({
		focusGroup,
		medium,
		topic,
		strategy: strategies.pregenerate,
	});
	console.timeEnd("regeneration");

	isRegenerating = false;

	if (await hasEnoughIdeas()) {
		return;
	}

	/**
	 * this promise is not awaited by design, so it runs in the background
	 */
	regenerate();
}

/**
 * Checks if there are enough pregenerated ideas for the current dice sides
 * @returns {Promise<boolean>}
 */
async function hasEnoughIdeas() {
	const { focusGroup, topic, medium } = getAllLabelsForCurrentSides();

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

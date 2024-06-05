import { getLabelsForCurrentSides } from "../../../state/state.js";
import { generateIdea } from "../../idea-generation/idea-generation.js";
import { strategies } from "../../idea-generation/constants.js";

/**
 * Handles the generation of a new idea, in realtime.
 * @param {ServerResponse} response
 * @returns {Promise<void>}
 */
export async function handleGenerate(response) {
	const { focusGroup, topic, medium } = getLabelsForCurrentSides();

	const idea = await generateIdea({
		focusGroup,
		topic,
		medium,
		strategy: strategies.realtime,
	});

	response.end(JSON.stringify(idea));
}

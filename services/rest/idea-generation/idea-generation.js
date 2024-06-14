import { getIdea } from "./idea-text.js";
import { createIllustration } from "./idea-illustration.js";
import { createPostcard } from "./postcard/postcard.js";
import { saveInHistory, saveInPregenerated } from "./storage.js";
import { strategies } from "./constants.js";

/**
 * @typedef {Object} Idea
 * @property {string} productIdea
 * @property {string} focusGroup
 * @property {string} topic
 * @property {string} medium
 */

/**
 * Generates an idea, illustration and postcard based on the given parameters.
 * Saves the idea in the history or pregenerated ideas based on the strategy.
 * @param {string} focusGroup
 * @param {string} topic
 * @param {string} medium
 * @param {string} strategy
 * @returns {Promise<{focusGroup: string, imagePrompt: string, productIdea: string, topic: string, medium: string}>}
 */
export async function generateIdea({ focusGroup, topic, medium, strategy }) {
	try {
		console.time("idea-generation");
		const { productIdea, imagePrompt } = await getIdea({
			focusGroup,
			topic,
			medium,
		});
		console.timeEnd("idea-generation");

		console.time("illustration-generation");
		await createIllustration(imagePrompt);
		console.timeEnd("illustration-generation");

		console.time("postcard-creation");
		await createPostcard({ focusGroup, topic, medium, productIdea });
		console.timeEnd("postcard-creation");

		if (strategy === strategies.pregenerate) {
			console.time("save-in-pregenerated");
			await saveInPregenerated({ focusGroup, topic, medium, productIdea });
			console.timeEnd("save-in-pregenerated");
		}

		if (strategy === strategies.realtime) {
			console.time("save-in-history");
			await saveInHistory({ focusGroup, topic, medium, productIdea });
			console.timeEnd("save-in-history");
		}
		return { productIdea, imagePrompt, focusGroup, topic, medium };
	} catch (error) {
		console.error(error);
		console.error("Error while generating idea. Retrying...");
		return generateIdea({ focusGroup, topic, medium, strategy });
	}
}

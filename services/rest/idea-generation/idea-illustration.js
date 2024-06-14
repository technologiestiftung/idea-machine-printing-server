import { ILLUSTRATION_FILE_PATH } from "./constants.js";
import fs from "node:fs";

/**
 * Download an image from the given URL and save it to the illustration file path.
 * @param {string} url
 * @returns {Promise<void>}
 */
async function download(url) {
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();
	fs.writeFileSync(ILLUSTRATION_FILE_PATH, Buffer.from(buffer));
}

/**
 * Get an illustration for the idea via dall-e 3 and download it.
 * @param {string} imagePrompt
 * @returns {Promise<void>}
 */
export async function createIllustration(imagePrompt) {
	const response = await fetch("https://api.openai.com/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: "dall-e-3",
			prompt: `
			Visualize this idea: ${imagePrompt}

			The mood of the illustration is	joyful and futuristic.
			The style is a mix of SOLARPUNK aesthetic and studio ghibli films.
			The colors are soft and similar to the movie spirited away.
			DIGITAL CONCEPT ART, Semi-photorealistic.
			The scene is illuminated by soft, warm light, creating a utopian atmosphere.
	`,
			n: 1,
			size: "1024x1024",
		}),
	});

	const dalleResponse = await response.json();

	if (dalleResponse.errors) {
		console.log(imagePrompt);
		console.log(dalleResponse);
		throw new Error(dalleResponse.errors[0].message);
	}

	if (!dalleResponse.data?.[0]?.url) {
		console.log(imagePrompt);
		console.log(dalleResponse);
		throw new Error("No image URL was returned from the DALL-E API.");
	}

	const imgUrl = dalleResponse.data[0].url;

	await download(imgUrl);
}

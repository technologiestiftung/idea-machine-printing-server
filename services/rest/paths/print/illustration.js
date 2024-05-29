import { jpgFilePath } from "./constants.js";
import fs from "node:fs";

async function downloadImage(url) {
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();
	fs.writeFile(jpgFilePath, Buffer.from(buffer), () =>
		console.log("finished downloading image"),
	);
}

export async function getIllustration(idea) {
	const response = await fetch("https://api.openai.com/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: "dall-e-3",
			prompt: `
			Visualize this idea: ${idea.image_prompt}

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
	const imgURL = dalleResponse.data[0].url;

	downloadImage(imgURL);

	if (!imgURL) {
		return "error";
	}

	return imgURL;
}

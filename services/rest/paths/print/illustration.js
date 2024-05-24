export async function getIllustration({ idea }) {
	console.log(idea);
	const response = await fetch("https://api.openai.com/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: "dall-e-3",
			prompt: `
			Visualize ${idea.summary}
			The mood of the illustration is	playful, whimsical, energetic, hazy.
			The style is a mix of SOLARPUNK, retro-futurim, concept art, studio ghibli.
	`,
			n: 1,
			size: "1024x1024",
		}),
	});

	const dalleResponse = await response.json();
	const imgURL = dalleResponse.data[0].url;

	// const imgURL = "./img/img_placeholder.png";

	if (!imgURL) {
		return "error";
	}

	return imgURL;
}

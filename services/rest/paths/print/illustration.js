export async function getIllustration({ idea }) {
	console.log(idea.image_prompt);
	const response = await fetch("https://api.openai.com/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: "dall-e-3",
			prompt: `
			Visualize this idea:  ${idea.image_prompt}

			The mood of the illustration is	joyful and futuristic.

			The style is SOLARPUNK.

			The illustration shows citizens of Berlin.
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

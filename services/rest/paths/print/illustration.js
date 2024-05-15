export async function getIllustration({ idea }) {
	const response = await fetch("https://api.openai.com/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: "dall-e-3",
			prompt: `
			Generiere ein Bild im 80er Jahre Postkarten Stil basierend auf folgende Idee: ${idea}.
	`,
			n: 1,
			size: "1024x1024",
		}),
	});

	const dalleResponse = await response.json();
	const imgURL = dalleResponse.data[0].url;

	// const imgURL = "img_placeholder.png";

	if (!imgURL) {
		return "error";
	}

	return imgURL;
}
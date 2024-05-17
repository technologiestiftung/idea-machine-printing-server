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
			Generiere ein Bild das folgende als Idee als Illustration darstellt: ${idea}.
			Die Illustration zeigt einen medium bis wide Shot der Stadtszene.
			Die Stimmung is positiv. Menschen sollen im Mittelpunkt stehen.
			Solarpunk, Retro-Futurism, Concept Art, 80s.
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

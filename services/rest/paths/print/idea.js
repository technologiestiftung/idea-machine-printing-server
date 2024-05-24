import { getLabelsForCurrentSides } from "../../../state/state.js";

export async function getIdea() {
	const { focusGroup, topic, medium } = getLabelsForCurrentSides();

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: `You are a helpful assistant designed to output JSON. 
					The JSON keys are "product_idea" and "summary". 
					"product_idea" is the full version of the generated answer in German in 40 words.
					"summary" is the product_idea described in visual detail for an image generation with DALL-E in English.`,
				},
				{
					role: "user",
					content: `
	Generiere mir eine neue Idee für ein nachhaltiges Berlin, deren Funktion in einer Zeile beschrieben wird.
	Themenfeld: ${topic}, Zielgruppe: ${focusGroup}, Medium: ${medium}.
	Ein bisschen futuristisch und witzig kann die Antwort auch sein.
	Die Antwort soll wie ein persönlicher Nachricht an mich selbst in der Vergangenheit formuliert sein.
	`,
				},
			],
			temperature: 0.7,
		}),
	});

	const { choices } = await response.json();

	if (!choices || choices.length < 1) {
		return "error";
	}

	const idea = JSON.parse(choices[0].message.content);

	// const idea = `"ParkFit": Ein smartes Armband, das die Bewegung der Berliner:innen
	// 	im Volkspark Friedrichshain überwacht und sie mit gesunden SnackEmpfehlungen belohnt, basierend auf ihrem Aktivitätslevel.`;
	return { idea, focusGroup, topic, medium };
}

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
					content: `
						You are a helpful assistant designed to output JSON.
						The JSON keys are "product_idea" and "image_prompt".
						"product_idea" is the full version of the generated answer in German in 40 words.
						"image_prompt" is brief english description of product_idea with visual details
						for an image generated with DALL-E 3.

						Die Antwort soll witzig und wie eine persönliche Nachricht klingen.
						Du lebst einige Jahrzehnte in der Zukunft und schreibst die Nachricht an dich selbst in der Vergangenheit im Jahr 2024.
						Die Antwort soll etwa 350 Zeichen haben.`,
				},
				{
					role: "user",
					content:
						"Generiere eine Idee für ein lebenswertes Berlin, deren Funktion in einer Zeile beschrieben wird. Es soll eine zukunftsweisende und innovative Idee sein, die Leute inspiriert.\nThemenfeld: mobility & transport, Zielgruppe: Berlin citizens, Medium: IoT.",
				},
			],
			temperature: 0.8,
		}),
	});

	const { choices } = await response.json();

	if (!choices || choices.length < 1) {
		return "error";
	}

	const idea = JSON.parse(choices[0].message.content);

	// const idea = {
	// 	product_idea:
	// 		"Hey Vergangenheits-Ich! Ich habe die perfekte Idee für ein lebenswerteres Berlin: Ein fliegender Teppich-Verleihservice! Schwebend über den Straßen Berlins kannst du Staus umgehen und die Stadt aus der Vogelperspektive entdecken. Einfach magisch, oder? 🧞‍♂️✨",
	// 	image_prompt:
	// 		"A futuristic image of Berlin with flying carpets gliding above the streets, transporting people smoothly through the city. The magical scene includes colorful carpets with intricate designs, adding a touch of whimsy to urban mobility.",
	// };
	return { idea, focusGroup, topic, medium };
}

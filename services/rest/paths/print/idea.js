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

						The JSON keys are "productIdea" and "imagePrompt".
						
						"productIdea" is the full version of the generated answer in German.
						1. The answer should be maximally 350 characters long.
						2. The answer should be witty and sound like a personal message.
						3. You live several decades in the future and write the message to yourself in the past in 2024.
						
						"imagePrompt" describes the productIdea in english. 
						1. Focus on specific, visually representable elements.
						2. Describe actions and scenarios rather than abstract concepts.
						3. Avoid ambiguous language that could be interpreted as including text.
						`,
				},
				{
					role: "user",
					content: `Generiere eine Idee für ein lebenswertes Berlin, deren Funktion in einer Zeile beschrieben wird. 
					Es soll eine zukunftsweisende und innovative Idee sein, die Leute inspiriert.
					\nThemenfeld: ${topic}, Zielgruppe: ${focusGroup}, Medium: ${medium}.`,
				},
			],
			temperature: 0.8,
		}),
	});

	const { choices } = await response.json();

	if (!choices || choices.length < 1) {
		return "error";
	}

	const { productIdea, imagePrompt } = JSON.parse(choices[0].message.content);

	// const idea = {
	// 	productIdea:
	// 		"Hey Vergangenheits-Ich! Ich habe die perfekte Idee für ein lebenswerteres Berlin: Ein fliegender Teppich-Verleihservice! Schwebend über den Straßen Berlins kannst du Staus umgehen und die Stadt aus der Vogelperspektive entdecken. Einfach magisch, oder? 🧞‍♂️✨",
	// 	imagePrompt:
	// 		"A futuristic image of Berlin with flying carpets gliding above the streets, transporting people smoothly through the city. The magical scene includes colorful carpets with intricate designs, adding a touch of whimsy to urban mobility.",
	// };
	return { productIdea, imagePrompt, focusGroup, topic, medium };
}

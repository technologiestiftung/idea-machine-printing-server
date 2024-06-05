import { getPrompt } from "../prompt.js";

/**
 * Get an idea for a product via gpt-4o
 * @param focusGroup
 * @param topic
 * @param medium
 * @returns { Promise<{ imagePrompt: string, productIdea: string }> }
 */
export async function getIdea({ focusGroup, topic, medium }) {
	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		},
		body: JSON.stringify(getPrompt({ topic, focusGroup, medium })),
	});

	const { choices } = await response.json();

	if (!choices || choices.length < 1) {
		throw new Error("No choices found");
	}

	let { content } = choices[0].message;

	if (content.includes("```")) {
		content = content.replace("```json", "");
		content = content.replace("```", "");
	}

	const { productIdea, imagePrompt } = JSON.parse(content);

	// const idea = {
	// 	productIdea:
	// 		"Hey Vergangenheits-Ich! Ich habe die perfekte Idee für ein lebenswerteres Berlin: Ein fliegender Teppich-Verleihservice! Schwebend über den Straßen Berlins kannst du Staus umgehen und die Stadt aus der Vogelperspektive entdecken. Einfach magisch, oder? 🧞‍♂️✨",
	// 	imagePrompt:
	// 		"A futuristic image of Berlin with flying carpets gliding above the streets, transporting people smoothly through the city. The magical scene includes colorful carpets with intricate designs, adding a touch of whimsy to urban mobility.",
	// };
	return { productIdea, imagePrompt };
}

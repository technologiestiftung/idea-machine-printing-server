/**
 * Returns a prompt for the user to generate a product idea and an image prompt.
 * @param {string} topic
 * @param {string} focusGroup
 * @param {string} medium
 * @returns {{temperature: number, messages: [{role: string, content: string},{role: string, content: string}], model: string}}
 */
export function getPrompt({ topic, focusGroup, medium }) {
	return {
		model: "gpt-4o",
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
3. Avoid ambiguous language that could be interpreted as including text.`,
			},
			{
				role: "user",
				content: `
Generiere eine Idee für ein lebenswertes Berlin, deren Funktion in einer Zeile beschrieben wird. 
Es soll eine zukunftsweisende und innovative Idee sein, die Leute inspiriert.
Themenfeld: ${topic}, Zielgruppe: ${focusGroup}, Medium: ${medium}.`,
			},
		],
		temperature: 0.8,
	};
}

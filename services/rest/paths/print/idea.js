import { getDices, getLabels } from "../../../state/state.js";

export async function getIdea() {
	const { A, B, C } = getDices();

	const focusGroupSide = `A${A}`;
	const topicSide = `B${B}`;
	const mediumSide = `C${C}`;

	const labels = getLabels();

	const focusGroup = labels[focusGroupSide];
	const topic = labels[topicSide];
	const medium = labels[mediumSide];

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
					role: "user",
					content: `
Generiere mir eine neue Produktidee für ein smartes Berlin, deren Funktion in einer Zeile beschrieben wird. 
Themenfeld: ${topic}, Zielgruppe: ${focusGroup}, Medium: ${medium}. 
Ein bisschen futuristisch und witzig kann die Antwort auch sein. 
Die Antwort soll so formatiert sein: 
"Titel": Beschreibung
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

	const idea = choices[0].message.content;

	return { idea, focusGroup, topic, medium };
}

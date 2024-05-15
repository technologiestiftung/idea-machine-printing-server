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
	Die Antwort soll wie ein persönlicher Postkarten Text formuliert sein.
	Die Antwort ist von meinem zukünftifen ich an mich selbst geschrieben.
	Maximal 350 Zeichen.
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

	// const idea = `"ParkFit": Ein smartes Armband, das die Bewegung der Berliner:innen
	// 	im Volkspark Friedrichshain überwacht und sie mit gesunden SnackEmpfehlungen belohnt, basierend auf ihrem Aktivitätslevel.`;
	return { idea, focusGroup, topic, medium };
}

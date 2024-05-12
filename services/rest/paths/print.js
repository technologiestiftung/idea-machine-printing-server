import { getDices } from "../../state/state.js";
import labels from "../../state/labels.json" with { type: "json" };

export function handlePrinting(/*requestBody,*/ response) {
	const printingCommand = getPrintingCommand();

	response.statusCode = 200;
	response.end(JSON.stringify({ message: printingCommand }));

	// exec(printingCommand, (error, stdout, stderr) => {
	// 	if (error) {
	// 		console.error(error);
	// 		response.statusCode = 500;
	// 		response.end('error');
	// 		return;
	// 	}
	//
	// 	if (stderr) {
	// 		console.error(stderr);
	// 		response.statusCode = 500;
	// 		response.end('stderr');
	// 		return;
	// 	}
	//
	// 	response.statusCode = 200;
	// 	response.end(JSON.stringify({ message: "success" }));
	// });
}

function getPrintingCommand() {
	const { A, B, C } = getDices();

	const focusGroupSide = `A${A}`;
	const topicSide = `B${B}`;
	const mediumSide = `C${C}`;

	const focusGroup = labels[focusGroupSide];
	const topic = labels[topicSide];
	const medium = labels[mediumSide];

	// todo get idea from openai
	// todo get illustration from openai/stable-diffusion

	return `${focusGroup};${topic};${medium}`;
}

// function getPrintingCommand(idea) {
// 	return `echo 'Betreff: Idee
// Von: Ideenwürfel
// An: idee@ts.berlin
// ------------------
// ${idea}' | fold -w 18 -s | lp -d ${process.env.PRINTER_NAME}`;
// }

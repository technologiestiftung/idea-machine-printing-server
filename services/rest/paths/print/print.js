import { getIdea } from "./idea.js";
import { getIllustration } from "./illustration.js";
import { createPostcard } from "./postcard.js";
import childProcess from "child_process";

export async function handlePrinting(response) {
	const debugResult = await print();

	response.statusCode = 200;
	response.end(JSON.stringify({ message: debugResult }));
}

async function print() {
	console.time("idea-generation");
	const idea = await getIdea();
	console.timeEnd("idea-generation");

	console.time("illustration-generation");
	const imgURL = await getIllustration(idea);
	console.timeEnd("illustration-generation");

	console.time("postcard-creation");
	await createPostcard(idea, imgURL);
	console.timeEnd("postcard-creation");

	await printPostcard();

	return idea;
}

async function printPostcard() {
	// todo print pdf with lp -d ${process.env.PRINTER_NAME} idea.pdf
	console.log("mock printing postcard...");
	childProcess.execSync("open ./services/rest/paths/print/postcard.pdf");
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

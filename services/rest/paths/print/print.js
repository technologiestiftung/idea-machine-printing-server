import { getIdea } from "./idea.js";
import { getIllustration } from "./illustration.js";
import { createPostcard } from "./postcard.js";

export async function handlePrinting(response) {
	const debugResult = await print();

	response.statusCode = 200;
	response.end(JSON.stringify({ message: debugResult }));
}

async function print() {
	const idea = await getIdea();

	const imgURL = await getIllustration(idea);

	await createPostcard(idea, imgURL);

	await printPostcard();

	return idea;
}

async function printPostcard() {
	// todo print pdf with lp -d ${process.env.PRINTER_NAME} idea.pdf
	console.log("mock printing postcard...");
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

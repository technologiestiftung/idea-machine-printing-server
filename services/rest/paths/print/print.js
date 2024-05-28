import { getIdea } from "./idea.js";
import { getIllustration } from "./illustration.js";
import { createPostcard } from "./postcard.js";
import childProcess from "child_process";
import { saveInHistory } from "./history.js";
import { pdfFilePath } from "./constants.js";

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

	console.time("save-in-history");
	await saveInHistory(idea);
	console.timeEnd("save-in-history");

	console.time("print-postcard");
	await printPostcard();
	console.timeEnd("print-postcard");

	return idea;
}

async function printPostcard() {
	childProcess.execSync(`open ${pdfFilePath}`);

	if (process.env.PRINT === "1") {
		childProcess.execSync(
			`lp -o Pagesize=A6 -o landscape -o fit-to-page -o Duplex=DuplexTumble -d ${process.env.PRINTER_NAME} ${pdfFilePath}`,
		);
	}
}

import fs from "node:fs";
import { execSync } from "child_process";
import {
	relativeIllustrationFilePath,
	htmlFilePath,
	pdfFilePath,
} from "./constants.js";

export async function createPostcard(idea) {
	createPostcardHtml(idea);
	createPostcardPdf();
}

function createPostcardHtml({ idea }) {
	const html = `<!DOCTYPE html>
<html lang="de">
	<head>
		<title>Postcard</title>
	</head>
	<body>
		<h1>${idea}</h1>
		<img src="${relativeIllustrationFilePath}" alt="Illustration"/>
	</body>
</html>
`;

	try {
		fs.writeFileSync(htmlFilePath, html);
	} catch (error) {
		console.error(error);
	}
}

function createPostcardPdf() {
	try {
		execSync(
			`${process.env.CHROMIUM_EXECUTABLE_PATH} --headless --print-to-pdf=${pdfFilePath} ${htmlFilePath}`,
		);

		// execSync(
		// 	`chromium-browser --headless --print-to-pdf=${pdfFilePath} ${htmlFilePath}`,
		// );
	} catch (error) {
		console.error(error);
	}
}

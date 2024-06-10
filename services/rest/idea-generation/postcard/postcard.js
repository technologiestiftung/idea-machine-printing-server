import fs from "node:fs";
import { execSync } from "child_process";
import { HTML_FILE_PATH, PDF_FILE_PATH } from "../constants.js";
import { replaceWildcards } from "../../../state/state.js";

/**
 * Create the Postcard as an HTML website and convert it to a PDF
 * @param {Idea} idea
 * @returns {Promise<void>}
 */
export async function createPostcard(idea) {
	createPostcardHtml(idea);
	createPostcardPdf();
}

/**
 * Create the postcard as an HTML website
 * @param {Idea} idea
 */
function createPostcardHtml(idea) {
	const focusGroup = replaceWildcards(idea.focusGroup);
	const medium = replaceWildcards(idea.medium);
	const topic = replaceWildcards(idea.topic);

	const html = `<!DOCTYPE html>
	<html lang="de">
		<head>
			<meta charset="utf-8" />
			<link rel="stylesheet" href="./postcard.css">
			<link href="./font/jersey20.woff2" rel="stylesheet">
			<title>Postcard</title>
		</head>
		<body>
			<div class="frontside">
				<img src="img/illustration.png" alt="Illustration"/>
			</div>
			<div class="backside">
				<div class="message">
					<div class="text">
						<div class="title-behind">Grüße aus der Zukunft!</div>
						<div class="title">Grüße aus der Zukunft!</div>
						<div class="idea">${idea.productIdea}</div>
					</div>
					<div class="dices">
						<div class="dice1"><img src="./img/cube.svg" /> Wer? ${focusGroup}</div>
						<div class="dice2"><img src="./img/cube.svg" /> Was? ${topic}</div>
						<div class="dice3"><img src="./img/cube.svg" /> Wo? ${medium}</div>
					</div>
				</div>
				<div class="sender">
					<div class="header">
						<div class="credits">
							Sommerkonferenz 
							<br/>
							27 Juni 2024
						</div>
						<div class="stamp">
							<img src="img/citylab-logo_white.png" alt="Stamp" width="90%">
						</div>
					</div>
					<div class="address">
						<div class="line">
							<p>Platz der Luftbrücke 4</p>
						</div>
						<div class="line">
							<p>12101 Berlin</p>
						</div>
						<div class="line">
							<p>info@citylab-berlin.org</p>
						</div>
					</div>
				</div>
			</div>
		</body>
	</html>
	`;

	try {
		fs.writeFileSync(HTML_FILE_PATH, html);
	} catch (error) {
		console.error(error);
	}
}

/**
 * Convert the postcard HTML to a PDF via chromium headless
 */
function createPostcardPdf() {
	try {
		execSync(
			`${process.env.CHROMIUM_EXECUTABLE_PATH} --headless --print-to-pdf=${PDF_FILE_PATH} ${HTML_FILE_PATH}`,
		);

		// execSync(
		// 	`chromium-browser --headless --print-to-pdf=${pdfFilePath} ${htmlFilePath}`,
		// );
	} catch (error) {
		console.error(error);
	}
}
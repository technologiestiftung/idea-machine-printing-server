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
			<link href="./font/IBMPlexSans-Regular.woff2" rel="stylesheet">
			<link href="./font/IBMPlexSans-SemiBold.woff2" rel="stylesheet">
			<title>Postcard</title>
		</head>
		<body>
			<div class="frontside">
				<div class="title-text">
					<div class="title-big">GREETINGS</div>
					<div class="title-small">FROM BERLIN</div>
					<div class="title-big-behind">GREETINGS</div>
					<div class="title-small-behind">FROM BERLIN</div>
				</div>
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
					<div class="vertical-text">Sommerkonferenz 27. Juni 2024</div>
					<div class="header">
						<div class="qr-code">
							<img src="img/QR-code-Ideenwürfel.svg" alt="QR Code" />
							Scanne den QR Code und entdecke weitere Ideen unseres Würfelspiels!
						</div>
						<div class="stamp"></div>
					</div>
					<div class="address">
						<div class="line"></div>
						<div class="line"></div>
						<div class="line"></div>
					</div>
					<div class="project-info">
						<div>
							Diese Postkarte ist mit den Ideenwürfeln entstanden, einem
							interaktiven Würfelspiel vom CityLAB Berlin.
						</div>
						<div class="credits">
							<div class="more-info">
								<div>
									Mehr Infos: <br />
									<b>future-greetings.vercel.app</b>
								</div>
							</div>
							<img src="img/logo-citylab-color.svg" alt="Stamp" width="90%" />
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
		// 	`chromium-browser --headless --print-to-pdf=./services/rest/idea-generation/postcard/postcard.pdf ./services/rest/idea-generation/postcard/postcard.html`,
		// );
	} catch (error) {
		console.error(error);
	}
}

import fs from "node:fs";
import { execSync } from "child_process";
import { htmlFilePath, pdfFilePath } from "./constants.js";

export async function createPostcard(idea, imgURL) {
	console.log(idea);
	createPostcardHtml(idea, imgURL);
	createPostcardPdf();
}

function createPostcardHtml(idea, imgURL) {
	const html = `<!DOCTYPE html>
	<html lang="de">
		<head>
			<link rel="stylesheet" href="./postcard.css">
			<title>Postcard</title>
		</head>
		<body>
			<div class="frontside">
				<img src="${imgURL}" alt="Illustration"/>
			</div>
			<div class="backside">
				<div class="message">
					<h3>${idea.idea}</h3>
					<div class="dices">
						<div class="dice1">&#10066 ${idea.focusGroup}</div>
						<div class="dice2">&#10066 ${idea.topic}</div>
						<div class="dice3">&#10066 ${idea.medium}</div>
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

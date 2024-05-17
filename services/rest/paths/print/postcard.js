import fs from "node:fs";
import { execSync } from "child_process";
import { htmlFilePath, pdfFilePath } from "./constants.js";

export async function createPostcard(idea, imgURL) {
	createPostcardHtml(idea, imgURL);
	console.log(imgURL);
	createPostcardPdf();
}

function createPostcardHtml({ idea }, imgURL) {
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
					<h3>${idea}</h3>
				</div>
				<div class="sender">
					<div class="stamp">
						<img src="img/citylab-logo_white.png" alt="Stamp" width="90%">
					</div>
					<div class="address">
						<p>Platz der Luftbrücke 4</p>
						<p>12101 Berlin</p>
						<p>info@citylab-berlin.org</p>
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

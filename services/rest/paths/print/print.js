import childProcess from "child_process";
import { supabase } from "../../supabase.js";
import fs from "node:fs";

const PDF_FILE_PATH = "./services/rest/paths/print/postcard.pdf";

/**
 * Handles the printing of a postcard.
 * @param {Uint8Array[]} body
 * @param {ServerResponse} response
 * @returns {Promise<void>}
 */
export async function handlePrinting({ body, response }) {
	const requestBody = Buffer.concat(body).toString();
	const { postcard_url } = JSON.parse(requestBody);

	try {
		console.time("download-postcard");
		await downloadPostcard(postcard_url);
		console.timeEnd("download-postcard");

		console.time("print-postcard");
		await print();
		console.timeEnd("print-postcard");
	} catch (error) {
		console.error(error);
		response.statusCode = 500;
		response.end(JSON.stringify({ message: `error printing postcard` }));
		return;
	}

	response.statusCode = 200;
	response.end(JSON.stringify({ message: `printing job sent` }));
}

/**
 * Downloads the postcard from the supabase bucket.
 * @param {string} postcard_url
 * @returns {Promise<void>}
 */
async function downloadPostcard(postcard_url) {
	const { data, error } = await supabase.storage
		.from("postcards")
		.download(postcard_url);

	if (error) {
		throw error;
	}

	const buffer = Buffer.from(await data.arrayBuffer());

	fs.writeFileSync(PDF_FILE_PATH, buffer);
}

/**
 * Prints the postcard.
 * @returns {Promise<void>}
 */
async function print() {
	childProcess.execSync(`open ${PDF_FILE_PATH}`);

	if (process.env.PRINT === "1") {
		childProcess.execSync(
			`lp -o Pagesize=A6 -o portrait -o fit-to-page -o media=Lower -d ${process.env.PRINTER_NAME} ${PDF_FILE_PATH}`,
			// `lp -o Pagesize=A6 -o portrait -o fit-to-page -o media=Lower -d "EPSON_XP_8700_Series_USB_" ./services/rest/paths/print/postcard.pdf`,
		);
	}
}

import childProcess from "child_process";
import fs from "node:fs";
import { supabase } from "../supabase/supabase.js";

const PDF_FILE_PATH = "./services/print/postcard.pdf";

supabase
	.channel("schema-db-changes")
	.on(
		"postgres_changes",
		{
			event: "insert",
			schema: "public",
			table: "printing_jobs",
		},
		(data) => handlePrinting(data),
	)
	.subscribe();

export async function handlePrinting(data) {
	const { new: { postcard_url, id } } = data;

	try {
		console.time("download-postcard");
		await downloadPostcard(postcard_url);
		console.timeEnd("download-postcard");

		console.time("print-postcard");
		await print();
		console.timeEnd("print-postcard");

		console.time("update-printing-job");
		await updatePrintingJob(id);
		console.timeEnd("update-printing-job");
	} catch (error) {
		console.error(error);
	}
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

/**
 * Set the printing job as printed in the database.
 * @param {string} id
 * @returns {Promise<void>}
 */
async function updatePrintingJob(id) {
	const { error } = await supabase
		.from('printing_jobs')
		.update({ printed: true })
		.eq("id", id);

	if (error) {
		console.log(error)
	}
}

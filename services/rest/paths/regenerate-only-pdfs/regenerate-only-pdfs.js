import {
	ILLUSTRATION_FILE_PATH,
	PDF_FILE_PATH,
} from "../../idea-generation/constants.js";
import { supabase } from "../../../supabase/supabase.js";
import { createPostcard } from "../../idea-generation/postcard/postcard.js";
import fs from "node:fs";

/**
 *
 * @param {ServerResponse} response
 * @returns {Promise<void>}
 */
export async function handleRegenerateOnlyPdfs(response) {
	response.statusCode = 200;
	/**
	 * This promise is not awaited by design, so it runs in the background
	 */
	regenerateOnlyPdfs();
	response.end(JSON.stringify({ message: "ok" }));
}

async function regenerateOnlyPdfs() {
	const { /** @type dbIdea[] */ data, error } = await supabase
		.from("pregenerated_ideas")
		.select("*");

	if (error) {
		console.log(error);
		return;
	}

	let counter = 0;
	for (const idea of data) {
		console.log(`regenerating pdf ${counter + 1}/${data.length}`);

		const {
			idea: productIdea,
			topic,
			medium,
			focus_group: focusGroup,
			postcard_url,
			illustration_url,
		} = idea;

		await downloadIllustration(illustration_url);

		await createPostcard({
			productIdea,
			topic,
			medium,
			focusGroup,
		});

		await upsertPostcard(postcard_url);

		counter = counter + 1;
	}
}

async function downloadIllustration(illustration_url) {
	const { data, error } = await supabase.storage
		.from("illustrations")
		.download(illustration_url);

	if (error) {
		console.log(error);
		return;
	}

	const buffer = Buffer.from(await data.arrayBuffer());

	fs.writeFileSync(ILLUSTRATION_FILE_PATH, buffer);
	console.log("downloaded illustration successfully");
}

async function upsertPostcard(filename) {
	const file = fs.createReadStream(PDF_FILE_PATH);

	const { data, error } = await supabase.storage
		.from("postcards")
		.upload(filename, file, {
			duplex: "half",
			upsert: true,
		});

	if (error) {
		console.error(`upload error with file ${filename}.pdf, error:`, error);
		return;
	}

	console.log(`upserted file ${filename}.pdf successfully:`, data);
}

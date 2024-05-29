import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import { pdfFilePath, jpgFilePath } from "./constants.js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
	process.env.SUPABASE_API_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function savePostcard(timestamp) {
	const file = fs.createReadStream(pdfFilePath);

	const { error } = await supabase.storage
		.from("postcards")
		.upload(`${timestamp}.pdf`, file, {
			duplex: "half",
		});

	if (!error) {
		return;
	}

	console.error("upload error", error);
}

async function savePostcardImage(timestamp) {
	const file = fs.createReadStream(jpgFilePath);

	const { error } = await supabase.storage
		.from("postcardImages")
		.upload(`${timestamp}.jpg`, file, {
			duplex: "half",
		});

	if (!error) {
		return;
	}

	console.error("upload error", error);
}

async function saveIdea(idea, timestamp) {
	const { error } = await supabase.from("ideas").insert({
		idea: idea.idea,
		focus_group: idea.focusGroup,
		topic: idea.topic,
		medium: idea.medium,
		created_at: timestamp,
	});

	if (!error) {
		return;
	}

	console.error("insert error", error);
}

export async function saveInHistory(idea) {
	const timestamp = new Date().toISOString();
	await savePostcard(timestamp);
	await savePostcardImage(timestamp);
	await saveIdea(idea, timestamp);
}

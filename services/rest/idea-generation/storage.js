import fs from "node:fs";
import { ILLUSTRATION_FILE_PATH, PDF_FILE_PATH } from "./constants.js";
import { supabase } from "../supabase.js";

async function saveIllustration(timestamp) {
	const file = fs.createReadStream(ILLUSTRATION_FILE_PATH);

	const { data, error } = await supabase.storage
		.from("illustrations")
		.upload(`${timestamp}.png`, file, {
			duplex: "half",
		});

	console.log("illustration:", data);

	if (!error) {
		return data.path;
	}

	console.error("upload error", error);
}

async function savePostcard(timestamp) {
	const file = fs.createReadStream(PDF_FILE_PATH);

	const { data, error } = await supabase.storage
		.from("postcards")
		.upload(`${timestamp}.pdf`, file, {
			duplex: "half",
		});

	console.log("postcard:", data);

	if (!error) {
		return data.path;
	}

	console.error("upload error", error);
}

async function saveIdeaInHistory({
	idea,
	timestamp,
	postcardPath,
	illustrationPath,
}) {
	const { error } = await supabase.from("ideas").insert({
		idea: idea.productIdea,
		focus_group: idea.focusGroup,
		topic: idea.topic,
		medium: idea.medium,
		created_at: timestamp,
		illustration_url: illustrationPath,
		postcard_url: postcardPath,
	});

	if (!error) {
		return;
	}

	console.error("insert error", error);
}

async function saveIdeaInPregenerated({
	idea,
	timestamp,
	illustrationPath,
	postcardPath,
}) {
	const { error } = await supabase.from("pregenerated_ideas").insert({
		idea: idea.productIdea,
		focus_group: idea.focusGroup,
		topic: idea.topic,
		medium: idea.medium,
		created_at: timestamp,
		illustration_url: illustrationPath,
		postcard_url: postcardPath,
	});

	if (!error) {
		return;
	}

	console.error("insert error", error);
}

/**
 * Saves the idea, illustration and postcard in the history table.
 * @param { Idea } idea
 * @returns {Promise<void>}
 */
export async function saveInHistory(idea) {
	const timestamp = new Date().toISOString();
	const postcardPath = await savePostcard(timestamp);
	const illustrationPath = await saveIllustration(timestamp);
	await saveIdeaInHistory({ idea, timestamp, postcardPath, illustrationPath });
}

/**
 * Saves the idea, illustration and postcard in the pregenerated ideas table.
 * @param { Idea } idea
 * @returns {Promise<void>}
 */
export async function saveInPregenerated(idea) {
	const timestamp = new Date().toISOString();
	const postcardPath = await savePostcard(timestamp);
	const illustrationPath = await saveIllustration(timestamp);
	await saveIdeaInPregenerated({
		idea,
		timestamp,
		postcardPath,
		illustrationPath,
	});
}

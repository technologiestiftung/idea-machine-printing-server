/**
 * Default path for the REST API.
 * @param {ServerResponse} response
 */
export function handleIsApiAlive(response) {
	response.end(JSON.stringify({ message: "ok" }));
}

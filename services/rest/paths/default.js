export function handleIsApiAlive(response) {
	response.end(JSON.stringify({ message: "ok" }));
}

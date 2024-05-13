import { getLabels, setLabels } from "../../state/state.js";

export function handleLabels({ request, body, response }) {
	switch (request.method) {
		case "GET":
			handleGetLabels(response);
			break;
		case "PUT":
			handlePutLabels({ body, response });
			break;
		default:
			response.statusCode = 405;
			response.end();
	}
}

function handleGetLabels(response) {
	response.end(JSON.stringify({ labels: getLabels() }));
}

function handlePutLabels({ body, response }) {
	const requestBody = Buffer.concat(body).toString();
	const newLabels = JSON.parse(requestBody).labels;

	setLabels(newLabels);

	response.end(JSON.stringify({ message: "success" }));
}

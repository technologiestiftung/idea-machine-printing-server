import http from "node:http";
import { handleShutdown } from "./paths/shutdown.js";
import { handlePrinting } from "./paths/print.js";
import { handleIsApiAlive } from "./paths/default.js";

const port = process.env.PORT;

const server = http.createServer();

server.on("request", handleRequest);

function handleRequest(request, response) {
	const headers = {
		"Access-Control-Allow-Origin": process.env.APP_ORIGIN,
		"Access-Control-Allow-Methods": "OPTIONS, POST, GET",
		"Access-Control-Allow-Credentials": true,
		"Access-Control-Allow-Headers": "Authorization, Content-Type",
		"Access-Control-Max-Age": 2592000, // 30 days
	};

	if (request.method === "OPTIONS") {
		response.writeHead(204, headers);
		response.end();
		return;
	}

	// if (request.headers.authorization !== `Bearer ${process.env.SECRET}`) {
	// 	response.statusCode = 403;
	// 	response.end();
	// 	return;
	// }

	response.writeHead(200, { ...headers, "Content-Type": "application/json" });

	let body = [];
	request
		.on("data", (chunk) => {
			body.push(chunk);
		})
		.on("end", () => {
			// const requestBody = Buffer.concat(body).toString();

			switch (request.url) {
				case "/shutdown":
					handleShutdown(response);
					break;
				case "/print":
					// handlePrinting(requestBody, response);
					handlePrinting(response);
					break;
				default:
					handleIsApiAlive(response);
			}
		});
}

server.listen(port, () => {
	console.info("listening on port:", port);
});

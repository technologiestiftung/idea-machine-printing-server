import http from "node:http";
import { handleIsApiAlive } from "./paths/default.js";
import { handleLabels } from "./paths/labels.js";
import { handlePrinting } from "./paths/print/print.js";
import { handleShutdown } from "./paths/shutdown.js";

const port = process.env.PORT;

const server = http.createServer();

server.on("request", handleRequest);

function handleRequest(request, response) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Request-Method", "OPTIONS, PUT, GET");

	// const headers = {
	// 	"Access-Control-Allow-Origin": "*",
	// 	"Access-Control-Allow-Methods": "OPTIONS, PUT, GET",
	// 	// todo not sure if we need those anymore
	// 	// "Access-Control-Allow-Credentials": true,
	// 	// "Access-Control-Allow-Headers": "Authorization, Content-Type",
	// 	// "Access-Control-Max-Age": 2592000, // 30 days
	// };

	if (request.method === "OPTIONS") {
		response.statusCode = 204;
		response.end();
		return;
	}

	response.setHeader("Content-Type", "application/json");

	let body = [];
	request
		.on("data", (chunk) => {
			body.push(chunk);
		})
		.on("end", async () => {
			switch (request.url) {
				case "/labels":
					handleLabels({ request, body, response });
					break;
				case "/print":
					await handlePrinting(response);
					break;
				case "/shutdown":
					handleShutdown(response);
					break;
				default:
					handleIsApiAlive(response);
			}
		});
}

server.listen(port, () => {
	console.info("listening on port:", port);
});

export default server;

import http from "node:http";
import { handleIsApiAlive } from "./paths/default.js";
import { handleLabels } from "./paths/labels.js";
import { handlePrinting } from "./paths/print/print.js";
import { handleShutdown } from "./paths/shutdown.js";

const port = process.env.PORT;

const server = http.createServer();

server.on("request", handleRequest);

function handleRequest(request, response) {
	response.once("readable", () => console.time("request-time"));
	response.on("end", () => console.timeEnd("request-time"));

	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Request-Method", "OPTIONS, PUT, GET");

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

server.listen(port, () => console.info("listening on port:", port));

server.on("close", () => console.log("server closed"));

export default server;

import { exec } from "child_process";

exec(`open index.html`, (error, stdout, stderr) => {
	if (error) {
		console.error(error);
		return;
	}

	if (stderr) {
		console.error(stderr);
		return;
	}

	console.log(stdout);
});

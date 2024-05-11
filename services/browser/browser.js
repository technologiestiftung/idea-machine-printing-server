import { exec } from "child_process";

exec(`echo "simulating opening browser"`, (error, stdout, stderr) => {
	if (error) {
		console.error(error);
		return;
	}

	if (stderr) {
		console.error(stderr);
		return;
	}

	console.log("successfully opened chromium");
});

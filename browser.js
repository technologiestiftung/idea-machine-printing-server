const { exec } = require("child_process");
const robot = require('robotjs');

exec('chromium-browser --start-fullscreen', (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    if (stderr) {
        console.error(stderr);
        return;
    }

    setTimeout(() => robot.keyTap("enter"), 5000);

    console.log('success');
})
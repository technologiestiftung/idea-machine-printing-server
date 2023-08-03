const { exec } = require("child_process");

exec('chromium-browser --start-fullscreen', (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    if (stderr) {
        console.error(stderr);
        return;
    }

    console.log('success');
})
const { exec } = require("child_process");
require('dotenv').config();

exec(`chromium-browser https://${process.env.HTTP_USER}:${process.env.HTTTP_SECRET}@${process.env.SERVER} ${process.env.APP_ORIGIN} --start-fullscreen`,
    (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return;
        }

        if (stderr) {
            console.error(stderr);
            return;
        }

        console.log('success');
    }
);
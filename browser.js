const { exec } = require("child_process");
require('dotenv').config();

setTimeout(() => {
    exec('xdotool key Return', (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return;
      }
  
      if (stderr) {
        console.error(stderr);
        return;
      }
  
      console.log('successfully pressed enter');
    })
  }, 20_000)

exec(`chromium-browser ${process.env.APP_ORIGIN}${process.env.APP_PATH} --start-fullscreen`,
    (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return;
        }

        if (stderr) {
            console.error(stderr);
            return;
        }

        console.log('successfully opened chromium');
    }
);
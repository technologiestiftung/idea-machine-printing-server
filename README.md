![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Idea Machine Printing Server

This code is meant to run a http server locally on a raspberry pi 32bit to orchestrate print requests coming from
the idea-machine webapp ([see here](https://github.com/technologiestiftung/idea-machine)).


## Prerequisites

Please have a look at the main repository: [https://github.com/technologiestiftung/idea-machine](https://github.com/technologiestiftung/idea-machine)

## Installation

### Install pm2 globally
```bash
npm i pm2 -g
```

### Make pm2 run automatically on system startup

Executing the following command will return another command that you
need to enter in your terminal to automatically start pm2 on system startup!
```bash
pm2 startup
```

For example (this is different on every machine!):
```console
admin@raspberrypi:~$ pm2 startup
[PM2] Init System found: launchd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/home/admin/.config/nvm/versions/node/v18.16.0/bin /home/admin/.config/nvm/versions/node/v18.16.0/lib/node_modules/pm2/bin/pm2 startup systemd -u admin --hp /home/admin
admin@raspberrypi:~$ sudo env PATH=$PATH:/home/admin/.config/nvm/versions/node/v18.16.0/bin /home/admin/.config/nvm/versions/node/v18.16.0/lib/node_modules/pm2/bin/pm2 startup systemd -u admin --hp /home/admin
```


### Install npm dependencies
If you are not in the project folder, cd into it and install dependencies:
```bash
cd idea-machine-printing-server && npm ci
```

## Usage or Deployment

### Uncomment the lines you need
inside the [index.js](index.js) file you'll see this at the end:
```javascript
function getPrintingCommand(idea) {

//   return  `echo 'Betreff: Idee
// Von: Ideenwürfel
// An: idee@ts.berlin
// ------------------
//   ${idea}' | fold -w 18 -s | lp -d ${process.env.PRINTER_NAME}`

  return `echo ${idea}`;
}
```

This is to make sure nothing gets printed by accident.
Uncomment the upper return once you're ready to print.

### Start and save processes with pm2
Start the processes with pm2 using the ecosystem config:
```bash
pm2 start ecosystem.config.js
```

Save the processes with pm2, so it automatically restarts them:
```bash
pm2 save
```

Pm2 will now automatically start processes from the ecosystem config on each system startup.

### Shutdown

We have implemented a `POST /shutdown` route that will result in this server and its host system shutting down gracefully. The route is necessary because we want to be able to control the shutdown of the system remotely.

Note that the environment variable `SHUTDOWNABLE` needs to be set to `1` for this to work. This is useful because in development mode we might not want to trigger the actual shutdown of the development system.

## Contributing

Before you create a pull request, write an issue so we can discuss your changes.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/raphael-arce"><img src="https://avatars.githubusercontent.com/u/8709861?v=4?s=64" width="64px;" alt="Raphael.A"/><br /><sub><b>Raphael.A</b></sub></a><br /><a href="https://github.com/technologiestiftung/idea-machine-printing-server/commits?author=raphael-arce" title="Code">💻</a> <a href="https://github.com/technologiestiftung/idea-machine-printing-server/pulls?q=is%3Apr+reviewed-by%3Araphael-arce" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dnsos"><img src="https://avatars.githubusercontent.com/u/15640196?v=4?s=64" width="64px;" alt="Dennis Ostendorf"/><br /><sub><b>Dennis Ostendorf</b></sub></a><br /><a href="https://github.com/technologiestiftung/idea-machine-printing-server/commits?author=dnsos" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Credits

<table>
  <tr>
    <td>
      Made by <a href="https://citylab-berlin.org/de/start/">
        <br />
        <br />
        <img width="200" src="https://logos.citylab-berlin.org/logo-citylab-berlin.svg" />
      </a>
    </td>
    <td>
      A project by <a href="https://www.technologiestiftung-berlin.de/">
        <br />
        <br />
        <img width="150" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-de.svg" />
      </a>
    </td>
    <td>
      Supported by <a href="https://www.berlin.de/rbmskzl/">
        <br />
        <br />
        <img width="80" src="https://logos.citylab-berlin.org/logo-berlin-senatskanzelei-de.svg" />
      </a>
    </td>
  </tr>
</table>

## Related Projects

https://github.com/technologiestiftung/idea-machine

https://github.com/technologiestiftung/idea-machine-dice

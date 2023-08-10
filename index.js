const { exec } = require("child_process");
const http = require('node:http');
require('dotenv').config();

const port = process.env.PORT;


const server = http.createServer();

server.on('request', handleRequest);

server.listen(port, () => {
  console.info('listening on port:', port)
});


function handleRequest(request, response) {
  const headers = {
    'Access-Control-Allow-Origin': process.env.APP_ORIGIN,
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': 2592000, // 30 days
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  if (request.headers.authorization !== `Bearer ${process.env.SECRET}`) {
    response.statusCode = 403;
    response.end();
    return;
  }

  response.writeHead(200, { ...headers, 'Content-Type': 'text/plain' });

  let body = [];
  request.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    const requestBody = Buffer.concat(body).toString();

    switch (request.url) {
      case "/shutdown":
        process.env.SHUTDOWNABLE == "1" && handleShutdown(response)
        break
      default:
        handlePrinting(requestBody, response)
    }
  })
}

function handleShutdown(response) {
  response.end(JSON.stringify({message: "Raspi is being shut down ..."}));
  exec("sudo shutdown -h now");
}


function handlePrinting(requestBody, response) {
  try {
    const { message } = JSON.parse(requestBody);
      
    const printingCommand = getPrintingCommand(message);

    exec(printingCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        response.statusCode = 500;
        response.end('error');
        return;
      }
  
      if (stderr) {
        console.error(stderr);
        response.statusCode = 500;
        response.end('stderr');
        return;
      }
  
      response.statusCode = 200;
      response.end('success');
    });
  } catch (error) {
    response.statusCode = 500;
    response.end();
  }
}

function getPrintingCommand(idea) {

//   return  `echo 'Betreff: Idee
// Von: Ideenwürfel
// An: idee@ts.berlin
// ------------------
//   ${idea}' | fold -w 18 -s | lp -d ${process.env.PRINTER_NAME}`

  return `echo ${idea}`;
}
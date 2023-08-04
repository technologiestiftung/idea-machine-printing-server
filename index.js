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
    const json = Buffer.concat(body).toString();

    try {
      const { message } = JSON.parse(json);
      console.log(message);
      handlePrinting(message, response);
    } catch (error) {
      response.statusCode = 500;
      response.end();
    }
  })
}


function handlePrinting(idea, response) {
  const printingCommand = getPrintingCommand(idea);

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
}

function getPrintingCommand(idea) {

//   return  `echo 'Betreff: Idee
// Von: Ideenwürfel
// An: idee@ts.berlin
// ------------------
//   ${idea}' | fold -w 18 -s | lp -d ${process.env.PRINTER_NAME}`

  return `echo ${idea}`;
}
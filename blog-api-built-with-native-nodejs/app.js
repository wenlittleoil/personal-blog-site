const http = require('http');
const os = require('os');
const handler = require('./src/router');

require('./src/test');

const port = 8008;

const server = http.createServer(handler);

server.listen(port, () => {
  console.log(`current operate system memory info: ${os.freemem()}/${os.totalmem()}`);
  console.log(`current nodejs process memory info: ${JSON.stringify(process.memoryUsage())}`);
  console.log(`server is listening at port ${port}`);
  console.log(process.env.author);
  console.log(process.env.INSTANCE_ID);
});



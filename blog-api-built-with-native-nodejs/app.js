const http = require('http');
const handler = require('./src/router');

const port = 8000;

const server = http.createServer(handler);

server.listen(port, () => {
  console.log(`server is listening at port ${port}`)
});

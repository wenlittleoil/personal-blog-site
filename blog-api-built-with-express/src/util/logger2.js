const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV;

const accessLog = () => {
  if (env === 'dev') {
    return morgan('dev', {
      // write log on request
      immediate: true,
      // only log error responses
      skip: (req, res) => false,
      // output to terminal
      stream: process.stdout,
    });
  }
  const logfile = path.join(__dirname, '../../logs', 'access.log');
  const accessLogStream = fs.createWriteStream(logfile, { flags: 'a' });
  return morgan('combined', {
    // write log on response
    immediate: false,
    // only log error responses
    skip: (req, res) => res.statusCode < 400,
    stream: accessLogStream,
  });
}

module.exports = {
  accessLog,
}

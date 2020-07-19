const path = require('path');

exports.keys = 'dfsak^33#J';

exports.security = {
  csrf: {
    enable: false,
  },
}

exports.logger = {
  dir: path.join(__dirname, '../logs/egg-logger'),
  level: 'INFO',
  consoleLevel: 'DEBUG',
}

exports.middleware = [
  'access',
];

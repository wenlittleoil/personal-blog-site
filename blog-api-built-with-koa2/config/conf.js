const defaultConfig = require('./conf.default');
const devConfig = require('./conf.dev');
const prodConfig = require('./conf.prod');

const env = process.env.NODE_ENV;

let config = {};

if (env === 'dev') {
  config = Object.assign(defaultConfig, devConfig);
} else if (env === 'prod') {
  config = Object.assign(defaultConfig, prodConfig);
}

module.exports = config;

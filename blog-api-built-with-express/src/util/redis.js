const redis = require('redis');
const {
  promisify,
} = require('util');
const config = require('../config/conf');

const client = redis.createClient(config.db.redis);

function get(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        resolve(JSON.parse(reply));
      } catch (error) {
        resolve(reply);
      }
    });
  });
}

function set(...args) {
  let key = args.shift();
  let value = args.shift();
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  return new Promise((resolve, reject) => {
    client.set(key, value, ...args, (err, reply) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(reply);
    });
  });
}

function del(key) {
  return promisify(client.del).bind(client)(key);
}

module.exports = {
  get,
  set,
  del,
  client,
}
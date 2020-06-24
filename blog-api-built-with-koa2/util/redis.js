const redis = require('redis');
const {
  promisify,
} = require('util');
const config = require('../config/conf');
const env = process.env.NODE_ENV;

const client = redis.createClient(config.db.redis);

client.on('reconnecting', options => {
  if (env === 'dev') {
    if (options.attempt > 5) {
      /**
       * redis client will reconnect to redis server automatically,
       * but if retry attempt failure reach 5 times,
       * quit the reconnection.
       */
      client.quit();
    }
  }
});

client.on("error", function(error) {
  const {
    code,
    address,
    port,
  } = error;
  if (env === 'dev') {
    if (code === 'ECONNREFUSED') {
      const msg = `Error! cannot connect to redis server ${address}:${port}`;
      console.error(msg);
    }
  } else {
    throw error;
  }
});

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
const {
  query,
} = require('./mysql');
const {
  ...redis
} = require('./redis');

module.exports = {
  query,
  mysql: {
    query,
  },
  redis: {
    ...redis
  }
}

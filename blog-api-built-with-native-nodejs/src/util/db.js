const {
  query,
  connection,
} = require('./mysql');
const {
  ...redis
} = require('./redis');

module.exports = {
  query,
  mysql: {
    query,
    connection,
  },
  redis: {
    ...redis
  }
}

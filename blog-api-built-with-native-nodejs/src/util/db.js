const {
  query,
} = require('./mysql');
const {
  get,
  set,
} = require('./redis');

module.exports = {
  query,
  mysql: {
    query,
  },
  redis: {
    get,
    set,
  }
}

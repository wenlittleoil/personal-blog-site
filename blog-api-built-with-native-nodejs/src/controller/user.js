const user = require('../service/user');

const login = req => {
  const {
    username,
    password,
  } = req.body;
  const result = user.login({
    username,
    password,
  });
  return result;
}

module.exports = {
  login,
}

const assert = require('assert');
const {
  Success,
  Failure,
} = require('../model');
const userService = require('../service/user');


const login = async req => {
  const {
    username,
    password,
  } = req.body;
  assert(username && password, 'missing parameter username/password');
  const result = await userService.login({
    username,
    password,
  });
  return new Success(result);
}

module.exports = {
  login,
}

const assert = require('assert');
const {
  Success,
  Failure,
} = require('../model');
const userService = require('../service/user');
const { sessions } = require('../util/session');

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
  
  const {
    user,
  } = result;
  if (user) {
    req.session.user = {
      id: user.id,
    };
    sessions[req.session.id] = req.session;
  }

  return new Success(result);
}

const loginTest = async req => {
  if (req.session.user) {
    return new Success({
      login_status: 1,
      info: 'already login',
      session: req.session,
    });
  }
  return new Failure({
    login_status: 0,
    info: 'warn: unlogin!',
    session: req.session,
  });
}

module.exports = {
  login,
  loginTest,
}

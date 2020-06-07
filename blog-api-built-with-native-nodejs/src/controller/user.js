const assert = require('assert');
const {
  Success,
  Failure,
} = require('../model');
const userService = require('../service/user');
// const { sessions } = require('../util/session');
const db = require('../util/db');
const {
  genSaltedPassword,
} = require('../util/security');

const login = async req => {
  const {
    username,
    password,
  } = req.body;
  assert(username && password, 'missing parameter username/password');
  const result = await userService.login({
    username,
    password: genSaltedPassword(password),
  });

  if (result.length) {
    // login successfully
    const user = result[0];

    // update req.session, req.user and sessions
    req.session.user = {
      id: user.id,
    };
    // sessions[req.session.id] = req.session;
    db.redis.set(req.session.id, req.session);
    req.user = user;

    return new Success({
      login_status: 1,
      login_info: 'logined',
      user,
    });
  } else {
    // login fail
    return new Failure({
      login_status: 0,
      login_info: 'unlogin',
      user: null,
    });
  }
}

const getUserInfo = async req => {
  if (req.user) {
    const {
      id,
    } = req.user;
    const user = await userService.getUserInfoById(id);
    return new Success({
      login_status: 1,
      login_info: 'logined',
      user,
    });
  }
  return new Failure({
    login_status: 0,
    login_info: 'unlogin',
    user: null,
  });
}

module.exports = {
  login,
  getUserInfo,
}

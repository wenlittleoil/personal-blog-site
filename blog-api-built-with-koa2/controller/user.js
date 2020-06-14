const assert = require('assert');
const {
  Success,
  Failure,
} = require('../model');
const {
  logined,
  unlogin,
} = require('../model/user');
const userService = require('../service/user');
const db = require('../util/db');
const {
  genSaltedPassword,
} = require('../util/security');

const login = async ctx => {
  const {
    username,
    password,
  } = ctx.request.body;
  assert(username && password, 'missing parameter username/password');
  const result = await userService.login({
    username,
    password: genSaltedPassword(password),
  });

  if (result.length) {
    // login successfully
    const user = result[0];

    // update ctx.session and ctx.user
    ctx.session.user = {
      id: user.id,
    }; // update sessions store automatically
    ctx.user = user;

    return logined(user);
  } else {
    // login fail
    return unlogin();
  }
}

const getUserInfo = async ctx => {
  if (ctx.user) {
    const {
      id,
    } = ctx.user;
    const user = await userService.getUserInfoById(id);
    return logined(user);
  }
  return unlogin();
}

module.exports = {
  login,
  getUserInfo,
}

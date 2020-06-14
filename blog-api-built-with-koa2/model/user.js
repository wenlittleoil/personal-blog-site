const {
  Success,
  Failure,
} = require('./index');

const logined = user => {
  return new Success({
    login_status: 1,
    login_info: 'logined',
    user,
  });
}

const unlogin = () => {
  return new Failure({
    login_status: 0,
    login_info: 'unlogin',
    user: null,
  });
}

module.exports = {
  logined,
  unlogin,
}

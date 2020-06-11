const {
  Failure,
} = require('../model');

module.exports = (req, res, next) => {
  if (!req.user) {
    const data = new Failure({
      login_status: 0,
      login_info: 'unlogin',
      user: null,
    });
    res.json(data);
    return;
  }
  next();
}

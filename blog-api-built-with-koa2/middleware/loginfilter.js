const {
  unlogin,
} = require('../model/user');

module.exports = () => {
  return async (ctx, next) => {
    if (!ctx.user) {
      ctx.body = unlogin();
      return;
    }
    await next();
  }
}

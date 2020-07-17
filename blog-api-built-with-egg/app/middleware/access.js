/**
* 挂载自定义日志实例及访问日志中间件
*/

const {
  v4: uuidv4,
} = require('uuid');
const Logger = require('../lib/logger');
const _ = require('lodash');

module.exports = () => {
  return async (ctx, next) => {

    const reqId = uuidv4().replace(/-/g, '');
    const uid = _.get(ctx, 'user.id', -1);
    ctx.req_id = reqId;
    // 对每个请求挂载一个日志实例
    ctx.wLogger = new Logger({
      reqId,
      uid,
    });

    const startTime = Date.now();
    await next();
    const endTime = Date.now();

    const {
      method,
      url,
      header,
    } = ctx.request;
    const {
      errno,
    } = ctx.body;

    // 统计访问日志
    ctx.wLogger.info({
      cat: 'access',
      msg: 'req_end',
      desc: {
        method,
        url,
        duration: `${endTime - startTime}ms`,
        errno,
        ua: header['user-agent'],
        ts0: new Date(startTime).toISOString(),
      },
    });

  }
}
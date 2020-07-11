const { Controller } = require('egg');
const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      // filename: 'winston-logs/myown-test.log'
      filename: path.resolve(__dirname, '../../logs/winston/my-test.log'),
    }),
  ],
});

class HomeCtl extends Controller {
  async index() {
    const { ctx } = this;
    // logger.log({
    //   level: 'debug',
    //   message: 'somebody access homepage',
    //   data: {
    //     ua: ctx.request.headers['user-agent'],
    //   }
    // });
    logger.info('somebody are accessing homepage now! haha');

    ctx.body = 'hello world';
  }
}

module.exports = HomeCtl;

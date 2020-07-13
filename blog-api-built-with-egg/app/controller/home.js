const { Controller } = require('egg');
const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

const {
  combine,
  timestamp,
  label,
  printf,
  simple,
  json,
  colorize,
} = winston.format;

const myFormat = printf(({
  level,
  message,
  label,
  timestamp,
  data,
}) => {
  return `${timestamp} [${level}] ${message} -- {${JSON.stringify(data)}} --${label}`;
});

const ignorePrivate = winston.format((info, opts) => {
  // console.log('FUNC-INFO: ', info, opts)
  if (info.private) return false;
  info.owner = 'wenlittleoil';
  return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    // label({
    //   label: 'media-report-preview',
    // }),
    // timestamp(),

    // myFormat,
    // simple(),

    ignorePrivate(),
    json(),
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        json(),
      ),
    }),

    // new winston.transports.File({
    //   // filename: 'winston-logs/myown-test.log'
    //   filename: path.resolve(__dirname, '../../logs/winston/my-test.log'),
    // }),
    new winston.transports.DailyRotateFile({
      dirname: path.resolve(__dirname, '../../logs/winston'),
      filename: 'myegg-%DATE%',
      datePattern: 'YYYY-MM-DD',
      maxSize: '1m',
      maxFiles: '40d',
    }),
  ],

  // unuse, egg-logger has handle this error
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.resolve(__dirname, '../../logs/winston/my-exception.log'),
    }),
  ],

  rejectionHandlers: [
    new winston.transports.File({
      filename: path.resolve(__dirname, '../../logs/winston/my-rejection.log'),
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

    // Promise.reject('test promise reject error from wenlittleoil.');

    logger.info('somebody are accessing homepage now!', {
      // timestamp: Date.now(),
      // label: 'media-report',
      // private: true, // if private true, current log record will be ignored
      ua: ctx.request.headers['user-agent'],
      message: ' are you ready to provide serive for him.', // auto concat before provided
    });

    ctx.body = 'hello world';
  }
}

module.exports = HomeCtl;

const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

const {
  combine,
  timestamp,
  printf,
} = winston.format;

class Logger {

  constructor({
    reqId,
    uid,
  }) {
    this.reqId = reqId;
    this.uid = uid;
  }

  // 接收上层传来的实参，输出日志行格式
  get myFormat() {
    if (this._formatInstance) {
      return this._formatInstance;
    }
    this._formatInstance = printf(({
      timestamp,
      reqId,
      uid,
      msg,
      desc,
    }) => {
      // 任何类型的日志都必须记录输出时间、请求唯一ID、用户ID(不存在则为-1)
      return JSON.stringify({
        ts: timestamp,
        req_id: reqId,
        uid,

        msg,
        desc,
      });
    });
    return this._formatInstance;
  }

  get myLogger() {
    if (this._loggerInstance) {
      return this._loggerInstance;
    }
    this._loggerInstance = winston.createLogger({
      // 只针对debug级别以上
      level: 'debug',
      format: combine(
        // 自动追加打日志的输出时间
        timestamp(),
        // 自定义日志行格式
        this.myFormat,
      ),
      transports: [],

      // unuse, egg-logger has handle this error
      exceptionHandlers: [
        new winston.transports.File({
          filename: path.resolve(__dirname, '../../logs/winston/exception.log'),
        }),
      ],

      rejectionHandlers: [
        new winston.transports.File({
          filename: path.resolve(__dirname, '../../logs/winston/rejection.log'),
        }),
      ],

    });
    return this._loggerInstance;
  }

  writeLog(args) {
    const {
      level,
      msg,
      cat,
      desc,
    } = args;

    // 每次都要在实际打日志时，才能根据传来的具体参数确定日志输出位置
    const consoleTran = new winston.transports.Console();
    const fileTran = new winston.transports.DailyRotateFile({
      dirname: path.resolve(__dirname, '../../logs/winston', cat),
      filename: `${level}.%DATE%`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '1m',
      maxFiles: '40d',
    });
    // 移除之前的输出位置，重新添加
    this.myLogger.clear().add(consoleTran).add(fileTran);
    this.myLogger.log({
      level,
      // 追加请求唯一ID
      reqId: this.reqId,
      // 追加标示请求身份的用户ID
      uid: this.uid,
      msg,
      desc,
    });
  }

  debug(args) {
    this.writeLog({
      ...args,
      level: 'debug',
    });
  }

  info(args) {
    this.writeLog({
      ...args,
      level: 'info',
    });
  }

  warn(args) {
    this.writeLog({
      ...args,
      level: 'warn',
    });
  }

  error(args) {
    this.writeLog({
      ...args,
      level: 'error',
    });
  }

}

module.exports = Logger;
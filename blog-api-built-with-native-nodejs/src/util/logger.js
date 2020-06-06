/**
 * How to use logger and parameter format
 * @param {object} require
 * @example
 * logger.info({
    cat: 'access', // require
    name: 'change addr for buy prod', // require
    desc: 'other detail message', // norequire
    data: {  // norequire
      order_id: 10,
      addr_id: 22,
    }
  });
 */

const fs = require('fs');
const path = require('path');
const {
  promisify,
} = require('util');
const moment = require('moment');

const logBaseDir = path.resolve(__dirname, `../../logs`);
const isExists = file => {
  return new Promise(resolve => {
    fs.access(file, err => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}
const mkdir = dir => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, err => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

const decorate = fn => args => {
  if (typeof args !== 'object') return;
  const {
    cat,
    name,
    desc = '',
    data = null,
  } = args;
  if (!cat || !name) return;

  const content = {
    cat,
    name,
    desc,
    data,
    time: moment().format('YYYY-MM-DD HH:mm:ss'),
  }

  fn(content);
}

let that = null;
const logger = {
  writeLog: async (args) => {
    const { 
      cat, 
      time,
      level,
      name,
      desc,
      data,
    } = args;
    const dir = path.join(logBaseDir, cat);
    const logfile = path.join(dir, `${time.split(' ')[0]}.log`);
    const existDir = await isExists(dir);
    if (!existDir) await mkdir(dir);
    const target = fs.createWriteStream(logfile, { flags: 'a' });

    const mainCont = {
      name,
      desc,
      data,
    }
    const line = `[${level}]--${JSON.stringify(mainCont)}--[${time}]`;
    target.write(line + '\n');
  },
  debug: decorate((args) => {
    Object.assign(args, { level: 'debug' });
    that.writeLog(args);
  }),
  info: decorate((args) => {
    Object.assign(args, { level: 'info' });
    that.writeLog(args);
  }),
  warn: decorate((args) => {
    Object.assign(args, { level: 'warn' });
    that.writeLog(args);
  }),
  error: decorate(() => {
    Object.assign(args, { level: 'warn' });
    that.writeLog(args);
  }),
};
that = logger;

module.exports = logger;
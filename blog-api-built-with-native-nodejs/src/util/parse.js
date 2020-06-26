const readline = require('readline');
const fs = require('fs');
const {
  isExists,
} = require('./tool');

/**
 * parse http request body
 * @param {IncomingMessage} req 
 * @returns Promise
 */
const parseBody = req => {
  return new Promise((resolve, reject) => {
    const {
      method,
      headers,
    } = req;
    if (method !== 'POST') {
      resolve(null);
      return;
    }
    const contentType = headers['content-type'];

    const immediateParseTypes = 
      ['application/json', 'application/x-www-form-urlencoded'];
    if (!immediateParseTypes.includes(contentType)) {
      /**
       * unsupport parse other content-type, 
       * such as multipart/form-data, application/xml etc.
       */
      resolve({});
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) resolve({});
      if (contentType === 'application/json') {
        resolve(JSON.parse(body));
      } else if (contentType === 'application/x-www-form-urlencoded') {
        const obj = body.split('&').reduce((prev, cur) => {
          const item = cur.split('=');
          const name = item[0];
          const value = decodeURIComponent(item[1]);
          prev[name] = value;
          return prev;
        }, {});
        resolve(obj);
      }
    });
  });
}

/**
 * parse http headers cookie
 * @param {IncomingMessage} req
 * @return Cookies Object
 */
const parseCookie = req => {
  const cookie = {};
  const rawCookies = req.headers.cookie;
  if (!rawCookies) return cookie;
  rawCookies.split(';').forEach(pair => {
    const pairArr = pair.split('=');
    const name = pairArr[0].trim();
    const value = decodeURIComponent(pairArr[1].trim());
    cookie[name] = value;
  });
  return cookie;
}

/**
 * use readline to parse logs
 * @param {string} logfile
 * @return {Array}
 */
const parseLog = async logfile => {
  const exist = await isExists(logfile);
  if (!exist) return Promise.reject(new Error(`${logfile} doesn't exists!`));
  const src = fs.createReadStream(logfile);
  const rl = readline.createInterface({
    input: src,
  });
  const list = [];
  return new Promise((resolve, reject) => {
    rl.on('line', lineText => {
      if (lineText) {
        const arr = lineText.split('--');
        const lineCont = JSON.parse(arr[1]);
        Object.assign(lineCont, {
          level: arr[0].replace(/\[|\]/g, ''),
          time: arr[2].replace(/\[|\]/g, ''),
        });
        list.push(lineCont);
      }
    });
    rl.on('close', () => {
      resolve(list);
    });
  });
}

module.exports = {
  parseBody,
  parseCookie,
  parseLog,
}

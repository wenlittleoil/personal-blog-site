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
      } else {
        /**
         * unsupport parse other content-type, 
         * such as multipart/form-data, application/xml etc.
         */
        resolve({});
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

module.exports = {
  parseBody,
  parseCookie,
}

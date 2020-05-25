const querystring = require('querystring');
const dispatcher = require('./dispatcher');

// { a: '2', b: [ 'yyy', '888' ], c: 'true' }
// console.log(querystring.parse('a=2&b=yyy&b=888&c=true'));

const getBody = req => {
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

const handler = (req, res) => {
  const {
    method,
    url,
  } = req;
  const urlParams = url.split('?');
  const path = urlParams[0];
  const query = querystring.parse(urlParams[1]);
  req.query = query;
  getBody(req).then(body => {
    req.body = body;
    res.setHeader('Content-Type', 'application/json');

    const dispatcherKey = `${method.toLowerCase()} ${path}`;
    const dispatcherValue = dispatcher[dispatcherKey];
    if (dispatcherValue) {
      const result = dispatcherValue.apply(null, [req]);
      res.end(JSON.stringify(result));
      return;
    }

    res.end('"404 Not Found"');
  });
}

module.exports = handler;

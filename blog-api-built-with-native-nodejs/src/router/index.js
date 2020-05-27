const assert = require('assert');
const querystring = require('querystring');
const dispatcher = require('./dispatcher');
const {
  Failure,
} = require('../model');

// { a: '2', b: [ 'yyy', '888' ], c: 'true' }
// console.log(querystring.parse('a=2&b=yyy&b=888&c=true'));

// parse http request body
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

// global error handle
let _res = null;
process.on('unhandledRejection', error => {
  /** all errors will be thrown to the client,
   * such as assert.AssertionError etc.
  */
  console.log('error: ', error);
  const err = new Failure(error.message);
  _res.end(JSON.stringify(err));
});
// process.on('uncaughtException', error => {
//   console.log('uncaughtException');
// });


// handle request
const handler = (req, res) => {
  _res = res;

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
      if (result instanceof Promise) {
        result.then(data => {
          res.end(JSON.stringify(data));
        });
      } else {
        res.end(JSON.stringify(result));
      }
      
      return;
    }

    res.end('"404 Not Found"');
  })
  // .catch(err => {
  //   console.log('err has been caught.')
  // });
}

module.exports = handler;

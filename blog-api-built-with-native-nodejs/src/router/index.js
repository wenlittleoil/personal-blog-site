const assert = require('assert');
const querystring = require('querystring');
const {
  parseCookie,
  parseBody,
} = require('../util/parse');
const dispatcher = require('./dispatcher');
const {
  Failure,
} = require('../model');

const { mountSession } = require('../util/session');
const sessionConfig = require('../config/conf').session;

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
  req.cookie = parseCookie(req);
  mountSession(req);

  parseBody(req).then(body => {
    req.body = body;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Set-Cookie', 
      `${sessionConfig.key}=${req.session.id}; path=/; expire=${new Date(req.session.cookie.expire).toGMTString()}`
    );

    const dispatcherKey = `${method.toLowerCase()} ${path}`;
    const dispatcherValue = dispatcher[dispatcherKey];
    if (dispatcherValue) {

      if (dispatcherValue.auth && !req.user) {
        // login filter
        const data = new Failure({
          login_status: 0,
          login_info: 'unlogin',
          user: null,
        });
        res.end(JSON.stringify(data));
        return;
      }

      const result = dispatcherValue.handle.apply(null, [req]);
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

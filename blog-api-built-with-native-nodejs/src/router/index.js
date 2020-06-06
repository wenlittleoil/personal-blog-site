const assert = require('assert');
const querystring = require('querystring');
const path = require('path');
const {
  parseCookie,
  parseBody,
  parseLog,
} = require('../util/parse');
const dispatcher = require('./dispatcher');
const {
  Failure,
} = require('../model');

const { mountSession } = require('../util/session');
const sessionConfig = require('../config/conf').session;
const logger = require('../util/logger');

// unuse code! test for parsing log function
// parseLog(path.resolve(__dirname, '../../logs/blog/2020-06-06.log'))
// .then(list => {
//   console.log(list);
// }).catch(err => {
//   console.log(err);
// });

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

  /**
   * For the CORS preflight request,
   * doesn't need to mount session or parse request body
   */
  const mount = method === 'OPTIONS' ? 
    Promise.resolve(null) : 
    mountSession(req).then(args => {
      return parseBody(req);
    });

  mount.then(body => {
    req.body = body;

    /**
     * backend server support cross domain XHR request
     * frontend browser should set xhr.withCredentials = true 
     * which bringing cookies back to the server
     */
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8002');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader(
      'Set-Cookie', 
      `${sessionConfig.key}=${req.session.id}; path=/; expire=${new Date(req.session.cookie.expire).toGMTString()}`
    );
    res.setHeader('Server', `Node v${process.versions.node}`);

    // access log
    logger.info({
      cat: 'access',
      name: 'req_start',
      data: {
        method,
        url,
        ua: req.headers['user-agent'],
      }
    });

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

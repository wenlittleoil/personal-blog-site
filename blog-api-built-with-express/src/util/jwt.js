const jwt = require('jsonwebtoken');
const config = require('../config/conf').jwt;

// https://github.com/auth0/node-jsonwebtoken

exports.JWT_ERROR = {
  'JsonWebTokenError': {
    code: 1,
    message: 'invalid token value',
  },
  'TokenExpiredError': {
    code: 2,
    message: 'token has expired',
  },
}

exports.sign = async info => {
  const {
    secret,
    algorithm,
    expiresIn, 
    issuer,
    audience,
  } = config;
  const {
    uid,
  } = info;

  const payload = {
    user: {
      id: uid,
    }
  };
  const options = {
    algorithm,
    expiresIn, 
    issuer,
    audience,
  };
  const promise = new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secret,
      options,
      (err, token) => {
        if (err) {
          reject(err.name);
          return;
        }
        resolve(token);
      },
    );
  });

  return promise;

}

exports.verify = async token => {
  const {
    secret,
    algorithm,
    issuer,
    audience,
  } = config;

  const promise = new Promise((resolve, reject) => {
    jwt.verify(
      token, 
      secret, 
      {
        algorithms: [algorithm],
        issuer,
        audience,
      }, 
      (err, result) => {
        if (err) {
          reject(exports.JWT_ERROR[err.name]);
          return;
        }
        resolve(result);
      },
    );
  });

  return promise;

}

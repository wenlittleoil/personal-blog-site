const crypto = require('crypto');
const config = require('../config/conf');

/**
 * generate salted password 
 * to avoid leaking raw password.
 * @param {string} rawPassword 
 * @returns {string} saltedPassword
 */
const genSaltedPassword = (rawPassword) => {
  const { passwordSecret } = config;
  const hash = crypto.createHash('md5');
  const saltedPassword = 
    hash.update(rawPassword + passwordSecret).digest('hex');
  return saltedPassword;
}

/**
 * generate safety session id,
 * procedural level to prevent hiting session id
 * @param {string} rawSessionid
 * @returns {string} safetySessionid
 */
const genSafetySessionid = rawSessionid => {
  const { sessionSecret } = config;
  const hash = crypto.createHmac('sha256', sessionSecret);
  const safetySessionid = 'sess:' +
    hash.update(rawSessionid).digest('base64').replace(/\=+$/g, '');
  return safetySessionid;
}

module.exports = {
  genSaltedPassword,
  genSafetySessionid,
}

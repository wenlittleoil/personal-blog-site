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

module.exports = {
  genSaltedPassword,
}

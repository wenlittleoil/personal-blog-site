const assert = require('assert');
const userDao = require('../dao/user');

function Service() {
  return {

    login: async ({
      username,
      password,
    }) => {
      const result = await userDao.login({
        username,
        password,
      });
      return result;
    },

    getUserInfoById: async id => {
      assert(id, 'missing parameter id');
      const result = await userDao.getUserInfoById(id);
      return result[0];
    }

  }
}

module.exports = Service();

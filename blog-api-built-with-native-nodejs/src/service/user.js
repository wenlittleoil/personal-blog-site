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
      if (result.length) {
        return {
          status: 1,
          user_info: result[0],
        }
      }
      return {
        status: 0,
        user_info: null,
      };
    }
  }
}

module.exports = Service();

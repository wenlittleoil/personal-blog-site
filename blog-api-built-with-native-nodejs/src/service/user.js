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
        // login successfully
        return {
          status: 1,
          user: result[0],
        }
      }
      // login fail
      return {
        status: 0,
        user: null,
      };
    }
  }
}

module.exports = Service();

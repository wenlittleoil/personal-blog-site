const db = require('../util/db');

function Dao() {
  return {
    login: ({
      username,
      password,
    }) => {
      const sql = `
        select id, username, realname, role, create_time
        from user
        where username = ?
        and password = ?
      `;
      return db.query(sql, [username, password]);
    }
  }
}

module.exports = Dao();
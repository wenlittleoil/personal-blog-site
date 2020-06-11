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
    },

    getUserInfoById: id => {
      const sql = `
        select id, username, realname, role, create_time
        from user
        where id = ?
      `;
      return db.mysql.query(sql, [id]);
    },

  }
}

module.exports = Dao();
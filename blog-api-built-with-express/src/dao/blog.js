const db = require('../util/db');
const xss = require('xss');

function Dao() {
  const connection = db.mysql.connection;
  const escape = connection.escape.bind(connection);

  return {
    getBlogList: ({
      uid,
      username,
      keyword,
    }) => {
      let sql = `
        select b.*, u.username 
        from blog as b
        inner join user as u
        on b.uid = u.id
        where 1 = 1
        and b.status > 0
      `;
      if (uid) {
        uid = escape(uid);
        sql += ` and b.uid = ${uid}`;
      }
      if (username) {
        username = escape(username);
        sql += ` and u.username = ${username}`;
      }
      if (keyword) {
        keyword = escape(keyword);
        sql += ` and b.title like '%${keyword}%'`;
      }
      return db.query(sql);
    },
    getBlogDetail: (id) => {
      const sql = `
        select b.*, u.username 
        from blog b
        inner join user u
        on b.uid = u.id
        where b.id = ?
      `;
      return db.query(sql, [id]);
    },
    createBlog: ({
      uid,
      title,
      content,
    }) => {
      // prevent xss attack
      title = xss(title);
      content = xss(content);

      const sql = `
        insert into blog
        (title, content, uid)
        values
        (?, ?, ?);
      `;
      return db.query(sql, [title, content, uid]);
    },
    updateBlog: ({
      uid,
      id,
      ...obj
    }) => {
      id = db.mysql.connection.escape(id);

      const str = 
        Object.keys(obj).map(field => {
          return `${field}=${JSON.stringify(xss(obj[field]))}`;
        }).join(',');

      const sql = `
        update blog set
        ${str}
        where id = ${id}
        and uid = ${uid}
      `;

      return db.query(sql);
    },
  };
}

module.exports = Dao();

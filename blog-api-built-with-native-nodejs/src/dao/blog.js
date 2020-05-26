const db = require('../util/db');

function Dao() {

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
      `;
      if (uid) {
        sql += ` and b.uid = ${uid}`;
      }
      if (username) {
        sql += ` and u.username = '${username}'`;
      }
      if (keyword) {
        sql += ` and b.title like '%${keyword}%'`;
      }
      return db.query(sql);
    },
    getBlogDetail: (id) => {
      const sql = `
        select * from blog
        where id = ?
      `;
      return db.query(sql, [id]);
    },
    createBlog: ({
      uid,
      title,
      content,
    }) => {
      const sql = `
        insert into blog
        (title, content, uid)
        values
        (?, ?, ?);
      `;
      return db.query(sql, [title, content, uid]);
    },
    updateBlog: ({
      id,
      ...obj
    }) => {
      const str = 
        Object.keys(obj).map(field => `${field}='${obj[field]}'`).join(',');
      const sql = `
        update blog set
        ${str}
        where id = ${id}
      `;
      return db.query(sql);
    },
  };
}

module.exports = Dao();

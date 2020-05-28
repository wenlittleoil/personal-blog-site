const mysql = require('mysql');
const config = require('../config/conf');

const connection = mysql.createConnection(config.db.mysql);

connection.connect();

function query(sql, values) {
  return new Promise((resolve, reject) => {
    console.log(`sql: ${sql} \n sqlvalues: ${values}`);

    if (values) {
      connection.query(sql, values, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    } else {
      connection.query(sql, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    }
  });
}

module.exports = {
  query,
};

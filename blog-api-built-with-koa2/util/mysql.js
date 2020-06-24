const mysql = require('mysql');
const config = require('../config/conf');
const env = process.env.NODE_ENV;

const connection = mysql.createConnection(config.db.mysql);

connection.connect();

connection.on('error', function(err) {
  const { 
    code,
    fatal,
    address,
    port,
  } = err;
  if (env === 'dev') {
    if (code === 'ECONNREFUSED' && fatal) {
      const msg = `Error! Cannot connect to mysql server ${address}:${port}`;
      console.error(msg);
    }
  } else {
    /**
     * should reconnect to mysql server automatically
     * but not throw error which make application crashed
     */ 
    throw err;
  }
});


function query(sql, values) {
  return new Promise((resolve, reject) => {
    if (env === 'dev') {
      console.log(`sql: ${sql} \n sqlvalues: ${values}`);
    }

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
  connection,
};

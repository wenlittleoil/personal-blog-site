const config = {
  db: {
    mysql: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '111111',
      database: 'blog',
    },
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }
}

module.exports = config;

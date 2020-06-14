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
  },
  whitelist: [
    'online.example.com',
    'localhost',
    '127.0.0.1',
  ],
}

module.exports = config;

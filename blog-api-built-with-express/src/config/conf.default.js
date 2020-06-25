const config = {
  session: {
    key: '_SID_',
    EXPIRE: 24*60*60*1000,
    secret: 'htysdfjk3l8q9c',
  },
  passwordSecret: 'dfjKdE7Chy',
  sessionSecret: 'u2ksd6CiI1L',
  jwt: {
    secret: 'd5fk&3g#_hK2',
    algorithm: 'HS256',
    expiresIn: 24 * 3600, // unit seconds
    issuer: 'west',
    audience: 'localhost',
  },
};

module.exports = config;

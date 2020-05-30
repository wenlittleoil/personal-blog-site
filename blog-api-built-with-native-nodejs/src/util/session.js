const sessionConfig = require('../config/conf').session;
const db = require('../util/db');

db.redis.del('name').then((res, reply) => console.log(res, reply))
db.redis.set('hello', 'wenshaoyou').then(result => {
  db.redis.get('hello').then(result => {
    console.log(result);
  })
});

// global sessions center
const sessions = {};

// generate new session object
const generateSession = () => {
  const now = Date.now();
  const id = `${now}${Math.random()}`;
  const session = {
    id,
    cookie: {
      expire: now + sessionConfig.EXPIRE,
    },
    user: null,
  }
  return session;
}

// handle session which is used identifying every request

// 1. on local sessions center
// const mountSession = req => {
//   const {
//     [sessionConfig.key]: sid,
//   } = req.cookie;
//   if (sid && sessions[sid]) {
//     const nowTime = Date.now();
//     const expireTime = sessions[sid].cookie.expire;
//     if (nowTime > expireTime) {
//       // current session already expired, delete it and regenerate
//       delete sessions[sid];
//       req.session = generateSession();
//       sessions[req.session.id] = req.session;
//     } else {
//       // current session not expired, update expire time
//       sessions[sid].cookie.expire = nowTime + sessionConfig.EXPIRE;
//       req.session = sessions[sid];
//     }
//   } else {
//     req.session = generateSession();
//     sessions[req.session.id] = req.session;
//   }
//   // compatible with non-session login methods in the future
//   req.user = req.session.user;
// }

// 2. on redis sessions center
const mountSession = async req => {
  const {
    [sessionConfig.key]: sid,
  } = req.cookie;

  return db.redis.get(sid).then(session => {

    if (sid && session) {
      const nowTime = Date.now();
      const expireTime = session.cookie.expire;
      if (nowTime > expireTime) {
        // current session already expired, delete it and regenerate
        db.redis.del(sid);
        req.session = generateSession();
        db.redis.set(req.session.id, req.session);
      } else {
        // current session not expired, update expire time
  
        session.cookie.expire = nowTime + sessionConfig.EXPIRE;
        db.redis.set(sid, session);
        req.session = session;
      }
    } else {
      req.session = generateSession();
      db.redis.set(req.session.id, req.session);
    }
    // compatible with non-session login methods in the future
    req.user = req.session.user;

  });
}

module.exports = {
  sessions,
  mountSession,
}

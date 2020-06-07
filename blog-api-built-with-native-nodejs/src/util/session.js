const sessionConfig = require('../config/conf').session;
const db = require('../util/db');
const {
  genSafetySessionid,
} = require('../util/security');

// global sessions center
// const sessions = {};

// generate new session object
const generateSession = () => {
  const now = Date.now();
  const id = genSafetySessionid(`${now}${Math.random()}`);
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
  const getCurrentSession = sid ? db.redis.get(sid) : Promise.resolve(null);
  return getCurrentSession.then(async session => {
    if (session) {
      const nowTime = Date.now();
      const expireTime = session.cookie.expire;
      if (nowTime > expireTime) {
        // current session already expired, delete it and regenerate
        await db.redis.del(sid);
        req.session = generateSession();
        await db.redis.set(req.session.id, req.session, 'PX', sessionConfig.EXPIRE);
      } else {
        // current session not expired, update expire time
        session.cookie.expire = nowTime + sessionConfig.EXPIRE;
        await db.redis.set(sid, session, 'PX', sessionConfig.EXPIRE);
        req.session = session;
      }
    } else {
      req.session = generateSession();
      await db.redis.set(req.session.id, req.session, 'PX', sessionConfig.EXPIRE);
    }
    // compatible with non-session login methods in the future
    req.user = req.session.user;
  });
}

module.exports = {
  // sessions,
  mountSession,
}

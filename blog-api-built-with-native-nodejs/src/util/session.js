const sessionConfig = require('../config/conf').session;

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
const mountSession = req => {
  const {
    [sessionConfig.key]: sid,
  } = req.cookie;
  if (sid && sessions[sid]) {
    const nowTime = Date.now();
    const expireTime = sessions[sid].cookie.expire;
    if (nowTime > expireTime) {
      // current session already expired, delete it and regenerate
      delete sessions[sid];
      req.session = generateSession();
      sessions[req.session.id] = req.session;
    } else {
      // current session not expired, update expire time
      sessions[sid].cookie.expire = nowTime + sessionConfig.EXPIRE;
      req.session = sessions[sid];
    }
  } else {
    req.session = generateSession();
    sessions[req.session.id] = req.session;
  }
  // compatible with non-session login methods in the future
  req.user = req.session.user;
}

module.exports = {
  sessions,
  mountSession,
}

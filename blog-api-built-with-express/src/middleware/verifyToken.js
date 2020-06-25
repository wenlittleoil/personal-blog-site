const jwt = require('../util/jwt');

const getToken = req => {
  if (req.query.token) return req.query.token;
  if (req.body.token) return req.body.token;
  if (req.cookies.token) return req.cookies.token;
  const authorization = req.headers['authorization'];
  if (!authorization) return '';
  const authInfo = authorization.split(' ');
  const type = authInfo[0];
  const token = authInfo[1];
  if (type === 'Bearer' && token) return token;
  return '';
}

module.exports = () => {
  /**
   * if error happen during token verifying,
   * don't terminate request directly,
   * but pass request to the downstream,
   * and downstream can handle jwt token error by access `req.jwt.error`
   */
  return (req, res, next) => {
    const token = getToken(req);

    jwt.verify(token)
      .then(result => {
        const {
          user,
        } = result;
        if (user) {
          req.jwt = {
            error: null,
            token,
          }
          req.user = user;
        } else {
          req.jwt = {
            error: jwt.JWT_ERROR['JsonWebTokenError'],
            token,
          }
          req.user = null;
        }
        next();
      })
      .catch(error => {
        req.jwt = {
          error,
          token,
        }
        req.user = null;
        next();
      });
    
  }
}

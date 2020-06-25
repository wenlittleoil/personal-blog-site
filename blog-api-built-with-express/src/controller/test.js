exports.testNeedBasicAuth = (req, res) => {

  const authFailHandle = (req, res) => {
    // tell the client to send Basic Authorization Info in the request headers;
    res.setHeader(
      'WWW-Authenticate', 
      'Basic realm="please enter your username and password!"'
    );
    res.writeHeader(401);
    res.end();
  }

  const auth = req.headers['authorization'];
  if (!auth) {
    authFailHandle(req, res);
    return;
  }

  console.log('auth: ', auth);

  const authinfo = auth.split(' ');
  const type = authinfo[0];

  if (type !== 'Basic') {
    return 'auth type does not match!';
  }

  const credential = authinfo[1];
  const account = new Buffer(credential, 'base64').toString('utf-8');
  const username = account.split(':')[0];
  const password = account.split(':')[1];

  if (username === 'wen' && password === '123') {
    return 'get result success';
  }
  return 'username or password does not right!';
  
}
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectRedis = require('connect-redis');
const cors = require('cors');
const compression = require('compression');
const csurf = require('csurf');

const RedisStore = connectRedis(session);
const {
  client: redisClient,
} = require('./src/util/redis');
const config = require('./src/config/conf');
const apiRouter = require('./src/routes');
const { accessLog } = require('./src/util/logger2');
const assignId = require('./src/middleware/assignId');
const bodyLimit = require('./src/middleware/bodyLimit');
const verifyToken = require('./src/middleware/verifyToken');

const app = express();
const port = 8008;

// Content-Encoding: gzip
app.use(compression({
  threshold: 1000,
  level: 9,
  filter: () => true,
  chunkSize: 300,
}));

// access log
app.use(
  '/api', 
  assignId, 
  accessLog()
);

// static resource service, for example, 
// open your browser and type url 'http://localhost:{port}/static/index.html'
// app.use('/static', ex11press.static('./src/public'));
app.use('/static', express.static(path.resolve(__dirname, 'src/public')));

// access control
app.use(cors(function(req, callback) {
  // Attention Bug! cors middleware will swallow error when it happened.
  const {
    whitelist,
  } = config;
  const currentOrigin = req.headers['origin'];
  // compatible with non-browser environment's request
  const canAccess = !currentOrigin || whitelist.find(origin => {
    return currentOrigin.indexOf(origin) > -1;
  });
  let corsOptions = {};
  if (canAccess) {
    corsOptions = {
      origin: currentOrigin,
      credentials: true,
    }
  } else {
    corsOptions = {
      origin: false,
    }
  }
  callback(null, corsOptions);
}));

app.use(
  '/api',
  bodyLimit({
    bytesLimit: 1000,
  }), 
);

// parse request body
// deprecated
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// parse request cookie
app.use(cookieParser());

// mount session
app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  cookie: {
    path: '/',
    // redis will auto delete it after exipre time
    maxAge: config.session.EXPIRE,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  // sessions stored on the redis instance
  store: new RedisStore({
    client: redisClient,
  }),
}), (req, res, next) => {
  // update req.user
  const user = req.session.user;
  if (user) {
    req.user = user;
  } else {
    req.user = null;
  }
  next();
});

// token verify and auth
app.use(verifyToken());

// api service
app.use('/api', (req, res, next) => {
  // console.log(req.cookies, req.sessionID, req.session);
  res.setHeader('Cache-Control', 'no-store');
  next();
}, apiRouter);

// request router error
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// error handle
app.use((error, request, response, next) => {
  if (error) {
    console.log(error)
    response.status(500).send('Server Side Error');
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./src/config/conf');
const apiRouter = require('./src/routes');
const app = express();
const port = 8008;

app.use('/', (req, res, next) => {
  next();
});

// deprecated
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
  secret: config.session.secret,
  cookie: {
    path: '/',
    maxAge: config.session.EXPIRE,
  },
  resave: false,
  saveUninitialized: true,
}), (req, res, next) => {
  const user = req.session.user;
  if (user) {
    req.user = user;
  } else {
    req.user = null;
  }
  next();
});

// app.use('/static', ex11press.static('./src/public'));
app.use('/static', express.static(path.resolve(__dirname, 'src/public')));
app.use('/api', (req, res, next) => {
  console.log(req.cookies, req.sessionID, req.session);
  next();
}, apiRouter);

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});
app.use((err, req, res, next) => {
  if (err) {
    console.log('accept four parameters will be error handle middleware by default');
    res.status(500).send('Server Side Error');
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

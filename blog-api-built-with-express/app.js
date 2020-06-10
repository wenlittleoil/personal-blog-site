const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const userRouter = require('./src/routes/user');

const app = express();
const port = 8008;

app.use('/', (req, res, next) => {
  next()
});

// deprecated
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/static', ex11press.static('./src/public'));
app.use('/static', express.static(path.resolve(__dirname, 'src/public')));
app.use('/api', userRouter);

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

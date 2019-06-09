const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const passportConfig = require('./passport');
require('dotenv').config();

const webSocket = require('./public/js/socket/server');
const indexRouter = require('./routes/index');
const connectDB = require('./schemas');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8000);

const sessionMiddleware = session({
  secret: 'chatsecret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

app.use(cookieParser('chatsecret'));
app.use(sessionMiddleware);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
connectDB();
passportConfig(passport);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), ': server start');
});

webSocket(server);
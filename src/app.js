var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv')
var cors = require('cors');
var path = require('path');
var dotenvExpand = require('dotenv-expand')


var myEnv = dotenv.config()
dotenvExpand.expand(myEnv)
const connection = require('../config/connection');





var userRouter = require('./routes/userRoutes');
var videoRouter = require('./routes/videoRoutes');
var profileRouter = require('./routes/profileRoutes');
var commentRouter = require('./routes/commentRoute');

var app = express();

app.use(cors());


// console.log("process.cwd() : ",process.cwd());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

// app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/video', videoRouter);
app.use('/api/profile', profileRouter);
app.use('/api/comment', commentRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: 'error'
  });
  // res.render('error');
});

module.exports = app;

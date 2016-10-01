var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var webrouter = require('./webrouter');
var posts = require('./tools/posts')
var partials = require('express-partials');

var posts = require('./tools/posts');
var _ = require('lodash');
var setting = require('./config/setting')

var course = require('./routes/course');
var user = require('./routes/user');//直接把user和收藏都扔到这里去
var admin = require('./routes/admin');//直接把user和收藏都扔到这里去


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
_.extend(app.locals,{
  setting:setting,
  isAdmin:posts.isAdmin
});

_.extend(app.locals,{
  Loader:require('loader'),
  filepath:'http://localhost:3000'
});

app.use(partials())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'myblog-exp-session',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    resave:false,
    saveUninitialized:false
}));



app.use('/',posts.userinfo,webrouter);
app.use('/',course);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  console.log(err);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      setting:setting,
      user:null
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.redirect('/err')
});

var host = 3033;
app.listen(host);
console.log("listen on "+host);
module.exports = app;


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var userDAO = require('./buildSrc/DB/userDAO');


var bodyParser = require('body-parser');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());



app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function (req, res) {
  res.render('index.html');
});



app.get('/home', (req, res) => {
  res.render('home.html');
});

var userDAO = require('./buildSrc/DB/userDAO');

app.post('/login', function (req, res) {
  let data = req.body;

  if (data.email && data.password) {
    userDAO.getUserByEmail(data.email, function (error, user) {
      if (error) {
        res.status(error.statusCode).json({error: true,error_reason: error.error_reason});
      } else {
        if (user.password == data.password) {
          delete user.password;
          res.status(200).json({error: false,user})
        } else {
          res.status(403).json({error: true,error_reason: "WRONG_PASSWORD"});
        }
      }
    })
  } else {
    res.status(400).json({error: true,msg: "BAD REQUEST"});
  }
})





app.post('/signup', function (req, res) {

  let user = req.body;

  if (user.name && user.email && user.password) {

    userDAO.addUser(user, function (err, data) {

      if (err) {
        res.status(err.statusCode).json({
          error: true,
          error_reason: err.error_reason
        });
      } else {
        res.status(200).json({
          error: false
        });
      }
    })




  } else {
    res.status(400).json({
      error: true,
      msg: "BAD REQUEST"
    });
  }




});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
var express = require('express');
var path = require('path');

var moment = require('moment');
// var favicon = require('serve-favicon');

require('dotenv').load();

var userDAO = require('./buildSrc/DB/userDAO');
var lectureDAO = require('./buildSrc/DB/lectureDAO');



var bodyParser = require('body-parser');

let bot = require('./buildSrc/bot');

var app = express();


app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));

app.use(bodyParser.json());



app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function (req, res) {
  res.render('index.html');
});



app.get('/home', (req, res) => {
  res.render('home.html');
});


app.get('/facebookTest', (req,res) => {
  res.render('facebook.html');
})

var userDAO = require('./buildSrc/DB/userDAO');

app.post('/login', function (req, res) {
  let data = req.body;
  console.log(JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  if (data.email && data.password) {
    userDAO.getUserByEmail(data.email, function (error, user) {
      if (error) {
        res.status(error.statusCode).json({
          error: true,
          error_reason: error.error_reason
        });
      } else {
        if (user.password == data.password) {
          delete user.password;
          user.id = user.email;
          delete user.email;
          res.status(200).json({
            error: false,
            user
          })
        } else {
          res.status(403).json({
            error: true,
            error_reason: "WRONG_PASSWORD"
          });
        }
      }
    })
  } else {
    res.status(400).json({
      error: true,
      msg: "BAD REQUEST"
    });
  }
})





app.post('/signup', function (req, res) {

  let user = req.body;
  res.setHeader('Content-Type', 'application/json');
  if (user.name && user.email && user.password) {

    userDAO.addUser(user, function (err, data) {

      if (err) {
        res.status(err.statusCode).json({
          error: true,
          error_reason: err.error_reason
        });
      } else {
        delete user.password;
        res.status(200).json({
          error: false,
          user
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

app.post('/conversation', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  bot.sendMessage(req, (err, watsonData) => {

    if (!err) {

      switch (watsonData.output.action) {

        case "nextLecture":
          getNextLecture(watsonData, res);
          break;
        default:
          res.status(200).json(watsonData);
      }
    } else {
      console.log('An error occurred');
      res.status(500).json(err);
    }


  });
})



const getNextLecture = (watsonData, res) => {
  console.log('Getting next lexture method invoked..');
  lectureDAO.getNextLecture((nextLecture) => {
    let context = watsonData.context;
    context.nextLecture = customizeDate(nextLecture);
    let data = {
      context: context,
      input: {
        text: ' '
      }
    }
    bot.sendMessage({
      body: data
    }, (err, newWatsonResponse) => {
      if (!err) {
        res.status(200).json(newWatsonResponse);
      } else {
        res.status(500).json(err);
      }
    })
  })
}



let days = {
  "0": "domingo",
  "1": "segunda-feira",
  "2": "terça-feira",
  "3": "quarta-feira",
  "4": "quinta-feira",
  "5": "sexta-feira",
  "6": "sabado"
}

const customizeDate = (lecture) => {
  if (lecture != null) {
    let formattedDate = lecture.formattedDate;
    // let tomorrow_date = moment(moment().add(1,'d').format("YYYY-MM-DD")).unix();
    let today_date = moment().format("YYYY-MM-DD");
    let tomorrow_date = moment().add(1, 'd').format("YYYY-MM-DD");
    let this_week = moment().add(7, 'd').format("YYYY-MM-DD");
    // let after_tmrw_date = moment(moment().add(2,'d').format("YYYY-MM-DD")).unix();
    if (moment(formattedDate).isSame(today_date, 'day')) {
      lecture.formattedDate = 'hoje';
    } else if (moment(formattedDate).isSame(tomorrow_date, 'day')) {
      lecture.formattedDate = 'amanhã';
    } else if (moment(formattedDate).isBefore(this_week, 'day')) {
      lecture.formattedDate = days[moment(formattedDate).weekday()]

    }
    return lecture
  }

  return null;
}


module.exports = app;
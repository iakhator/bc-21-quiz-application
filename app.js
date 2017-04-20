var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config();
var flash = require('express-flash-2');
var session = require('express-session');
var firebase = require('firebase');


var app = express();


var routes = require('./routes/index');

//connecting to the database
var config = {
    apiKey: "AIzaSyAASntt54R-xeea7z_G2hp6qCQ_cH8sl4k",
    authDomain: "quizapp-3676c.firebaseapp.com",
    databaseURL: "https://quizapp-3676c.firebaseio.com",
    projectId: "quizapp-3676c",
    storageBucket: "quizapp-3676c.appspot.com",
    messagingSenderId: "515269296181"
  };
  firebase.initializeApp(config);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser('secret'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized:true}));
app.use(flash());

app.use('/', routes);

app.listen(8080, function() {
    console.log("app started on port:8080");
});

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongoose = require("mongoose");
var dbConfig = require("./config/database");
var bluebird = require("bluebird");

var index = require('./routes/index');
var users = require('./routes/users');
var wiki = require("./routes/wiki");
var catalog = require("./routes/catalog");
var compression = require("compression");
var helmet = require("helmet");

var app = express();

mongoose.Promise = bluebird;
mongoose.connect(dbConfig.url, {
  useMongoClient: true
});

//Get db default connection
var db = mongoose.connection;

//Bind event to connection
db.on("open", function(db){
  //console.log(db);
});

db.on("error", function(){
  console.error("Error in db Connection");
});

//require("./models/book");

// view engine setup
app.engine('ejs', require('express-ejs-extend'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(helmet());
app.use(compression()); //compress all routes
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/wiki', wiki);
app.use("/catalog", catalog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

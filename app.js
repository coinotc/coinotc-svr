require('dotenv').config();
var http = require('http'),
  path = require('path'),
  methods = require('methods'),
  express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  passport = require('passport'),
  errorhandler = require('errorhandler'),
  mongoose = require('mongoose');
  Mailgun = require('mailgun-js');
  multer = require('multer'),
  googleStorage = require('@google-cloud/storage');
  cookieParser = require('cookie-parser');
  compression = require('compression');
  config = require('./config');
  notification = require('./workers/changeStream');

const { SHA256 } = require('sha2');
var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();
//var stream = notification.changeStream();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors());

app.use(require('morgan')('dev'));

app.use(cookieParser());

app.use(compression());
app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI, options);
} else {
  mongoose.connect(config.mongodb_url, options);
  mongoose.set('debug', true);
}
console.log(process.env.SESSION_SECRET);
var MS = require('express-mongoose-store')(session, mongoose);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MS({ ttl: 600000 }),
    resave: false,
    saveUninitialized: false
  })
);
//10 minute sessions

app.use(passport.initialize());
app.use(passport.session());

if (!isProduction) {
  app.use(errorhandler());
}

require('./models/User');
require('./models/orderInformation');
require('./config/passport');
require('./models/complain');
require('./models/advertisement');
require('./models/alert');
require('./models/banner-control');
require('./models/BackgroundUser');
require('./models/notification');

app.use(require('./routes'));

// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.error(
    'Failed to connect to DB ' + config.mongodb_url + ' on startup ',
    err
  );
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
  console.log(
    'Mongoose default connection to DB :' + config.mongodb_url + ' disconnected'
  );
});

var gracefulExit = function() {
  mongoose.connection.close(function() {
    console.log(
      'Mongoose default connection with DB :' +
        config.mongodb_url +
        ' is disconnected through app termination'
    );
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

/// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + server.address().port);
  const nyanbuffer = SHA256(`
  ░░░░░░░▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▄░░░░░░
  ░░░░░░█░░▄▀▀▀▀▀▀▀▀▀▀▀▀▀▄░░█░░░░░
  ░░░░░░█░█░▀░░░░░▀░░▀░░░░█░█░░░░░
  ░░░░░░█░█░░░░░░░░▄▀▀▄░▀░█░█▄▀▀▄░
  █▀▀█▄░█░█░░▀░░░░░█░░░▀▄▄█▄▀░░░█░
  ▀▄▄░▀██░█▄░▀░░░▄▄▀░░░░░░░░░░░░▀▄
  ░░▀█▄▄█░█░░░░▄░░█░░░▄█░░░▄░▄█░░█
  ░░░░░▀█░▀▄▀░░░░░█░██░▄░░▄░░▄░███
  ░░░░░▄█▄░░▀▀▀▀▀▀▀▀▄░░▀▀▀▀▀▀▀░▄▀░
  ░░░░█░░▄█▀█▀▀█▀▀▀▀▀▀█▀▀█▀█▀▀█░░░
  ░░░░▀▀▀▀░░▀▀▀░░░░░░░░▀▀▀░░▀▀░░░░
  `);
  console.log(nyanbuffer);
});

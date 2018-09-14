let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let passport = require('passport');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let envConfig = require('./config/env');
let cors = require('cors');

let usersController = require('./controllers/users');
let AuthController = require('./controllers/auth');

let isLoggedIn = require('./util/middlewares').isLoggedIn;
let isAdmin = require('./util/middlewares').isAdmin;
let app = express();

let server = require('http').Server(app);
let io = require('socket.io')(server);

let socket = require('./util/socket');

const viewDir = '../client/build';

socket.setSocket(io);

// view engine setup
app.set('views', path.join(__dirname, viewDir));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(require('express-session')({
  secret: envConfig.sessionSecret,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: envConfig.mongoURI
    // mongoOptions: advancedOptions // See below for details
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, viewDir)));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors());
// app.use('/api/users', isLoggedIn, usersController);
app.use('/api/users', usersController);

app.use('/api/auth', AuthController);


// Catch all other routes and return the index file
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, path.join(viewDir, 'index.html')));
});


// rewrite virtual urls to angular app to enable refreshing of internal pages
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
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
  res.json({'error': err});
});

module.exports = {app: app, server: server};
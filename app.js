'use strict';
/* jshint -W030 */
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  path = require('path'),
  flash = require('connect-flash'),
  passport = require('passport'),
  expressValidator = require('express-validator');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var db = require('./db');
var security = require('./security');
var register = require('./routes/register');
var config = require('./config');
var RedisStore = require("connect-redis")(express);
var redis = require("redis").createClient();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(expressValidator());
app.use(express.methodOverride());

var session_config = { secret: 'keyboard cat' };

if (config.session_store) { 
			console.log("enabled redis stored backend");
			session_config['store'] = new RedisStore({ host: config.redis.host, port: config.redis.port, client: redis } ); 
			}
app.use(express.session(session_config));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}

security.strategy;
/**
 * Routes
 */

// serve index and view partials

app.get('/', security.ensureAuthenticated, routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/jobs/:id', security.ensureAuthenticated, api.list);
app.get('/api/jobs/:id/:all', api.list);
app.get('/api/jobs', api.list);
app.get('/api/qc/:id', api.qc_list);
// redirect all others to the index (HTML5 history)

//login/logout/register points
app.get('/login', register.login_get);
app.get('/logout',register.logout_get);
app.get('/register', register.reg_get);
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), register.login_post);
app.post('/register',register.reg_post);

db.connectDatabase(config);
     // Socket.io Communication
  // Sync work only with two-phases commit disabled in postgresql
if (config.sync){
	io.sockets.on('connection', require('./routes/socket'));
}

/**
 * Start Server
 */

server.listen(app.get('port'), 'localhost', 511, function () {
  console.log('Express server listening on port ' + app.get('port'));
  /*var open = require('open');
  open('http://localhost:' + app.get('port') + '/');*/
});

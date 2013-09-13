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
  passport = require('passport');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var db = require('./db');
var security = require('./security');

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
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
app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.flash('error') });
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
	console.log("redirect");
    res.redirect('/');
  });
  
db.connectDatabase(function(){
  console.log("connected to DB");// your other code
});

  
  // Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));


/**
 * Start Server
 */

server.listen(app.get('port'), 'localhost', 511, function () {
  console.log('Express server listening on port ' + app.get('port'));
  /*var open = require('open');
  open('http://localhost:' + app.get('port') + '/');*/
});

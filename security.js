// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
'use strict';
/* jshint -W117 */


var passport = require('passport'), 
	LocalStrategy = require('passport-local').Strategy;
var db = require('./db');


module.exports.ensureAuthenticated = function (req, res, next) {
  
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

var users = [

];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) 
{
	db.client_pau("user").select().where('email',username).then  
	(
		function(resp) 
		{	
		console.log("entra resp");
		
		if (resp.length > 0)
			{
			users.push(resp[0]);
			console.log(resp);
			return fn(null, resp[0]);
			}
		else
			{
			return fn(null, null);
			}
		}, 
		function(err) 
		{
			console.log(err.message);
			return fn(null, null);
		}
	); 
}
/*  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}*/


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
module.exports.strategy  = passport.use(new 
	LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      
      findByUsername(username, function(err, user) {
console.log("does not wait");
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        console.log(password);
        console.log(user.password);
        if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
    });
  }
));


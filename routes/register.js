/*
 * Serve JSON to our AngularJS client
 */



/*
 * GET users listing.
 */
"use strict";
/* jshint -W098 */
/* jshint -W003 */
var q = require('q');
var db = require('../db');
var async = require('async');
var config = require('../config');
//jobs rest api

module.exports.reg = function(req, res){
	console.log(req.body.email);
	req.assert('First_name', 'Name is required').notEmpty();           //Validate name
	req.assert('Last_name', 'Name is required').notEmpty();           //Validate name
    req.assert('email', 'A valid email is required').isEmail();  //Validate email
	req.assert('Password', '4 to 20 characters required').len(4, 20);
	
    var errors = req.validationErrors();  
    if( !errors){   //No errors were found.  Passed Validation!
	console.log("correct");
	
	db.client_pau('user').insert({'email' : req.body.email, 'name' : req.body.First_name, 'surname' : req.body.Last_name, 'password' : req.body.Password, 'permissions' : 1, 'validated' : true}).then(
	function(resp) {
			console.log(resp);
			res.render('register',{'message' : 'Registration OK'} );
				}, 
	function(err) {
			res.render('register',{'message' : 'DB error'} );
});
    res.render('register',{'message' : 'Registration OK'} );
    }
    else {   //Display errors to user
		console.log(errors);
		res.render('register',{'message' : 'Registration Error'} );
    }
 };

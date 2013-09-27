'use strict';

var db = require('../db');
var config = require('./config_test');



module.exports = {
    setUp: function (callback) {
        db.connectDatabase(config);
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },

    test1: function (test) {
		db.client_pau("quality_control").select().where('job_id',10000000).then  
		(
			function(resp) 
			{
				console.log(resp);
				test.equals(resp.length, 0);
				test.done();
			}, 
			function(err) 
			{
				console.log(err.message);
				test.equals(false, false);
				test.done();
			}
			
		); 
		
    }/*,
    test_Create_quality_control : function(test) 
    {
    db.client_pau.transaction(function(t) 
		{
		db.client_pau("quality_control")
			.transacting(t)
			.insert({job_id : 100000, ref : "prova", check_name : "prova_anme", min_value : 50, max_value : 60, value : 40, unit : "m", qc_pass : true, time : "2013-09-09"})
			.then(function() {
			t.commit('You saved 3 books');
			}, t.rollback);
			test.done();
		});
    }*/
};

//TODO create table job,user and quality control
// 1: create a user
//2: create a simple tree job structure
//3: attach a quality control to the jobs
//4 test the rest apis
//5 test client side
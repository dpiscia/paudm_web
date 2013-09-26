'use strict';

var db = require('../db');



module.exports = {
    setUp: function (callback) {
        db.connectDatabase();
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
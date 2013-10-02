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
		
    },
    test_create_quality_control : function(test) 
    {
		
		db.client_pau.schema.hasTable('quality_control').then(function(exists) {
			if (!exists) 
			{
				return db.client_pau.schema.createTable('quality_control', function (table) 
				{
					table.increments('id').primary();
					table.integer('job_id');
					table.string('ref');
					table.string('check_name');
					table.float('min_value');
					table.float('max_value');
					table.float('value');
					table.string('unit');
					table.boolean('qc_pass');
					table.timestamps('time');
				})
				.then(
					function(val) 
					{
						console.log(val);
						console.log("OK table created");
						test.equals(true, true);
						test.done();
					}, 
					function(err) 
					{
						console.log(err);
						console.log("Err");
						test.equals(false, true);
						test.done();
					}
					);
			}
			else { 
						test.equals(true, true);
						test.done();
				}
		});
    },
    test_insert_quality_control : function(test) 
    {
		
		db.client_pau("quality_control")
			.insert({job_id : 100000, ref : "prova", check_name : "prova_anme", min_value : 50, max_value : 60, value : 40, unit : "m", qc_pass : true})
			.then(function(val) {
			console.log(val);
			console.log("OK");
			test.equals(true, true);
			test.done();
			}, 
			function(err) {
			console.log(err);
			console.log("Err");
			test.equals(false, true);
			test.done();
			}
		);
    },
     test_create_job_table : function(test) 
    {
		db.client_job.schema.hasTable('job').then(function(exists) {
			if (!exists) 
			{
			return db.client_job.schema.createTable('job', function (table) {
					table.increments('id').primary();
					table.integer('super_id');
					table.string('task');
					table.string('status');
					table.text('config');
					table.text('input');
					table.text('output');
					table.dateTime('ts_created');
					table.dateTime('ts_queued');
					table.dateTime('ts_started');
					table.dateTime('ts_ended');
			})
			.then(function(val) {
			console.log(val);
			console.log("OK table created");
			test.equals(true, true);
			test.done();
			}, 
			function(err) {
			console.log(err);
			console.log("Err");
			test.equals(false, true);
			test.done();
			}
		);
	}
		else { 
						test.equals(true, true);
						test.done();
				}
		});
	},
	test_insert_jobs : function(test) 
    {
		
		db.client_job("job")
			.insert([{ task : "example_task", config : "config", status : "DONE", input : "input", output : "40", ts_created : "12/12/12", ts_queued : "12/12/12",ts_started : "12/12/12",ts_ended : "12/12/12", },
			{super_id : 1, task : "example_child", config : "config", status : "DONE", input : "input", output : "40", ts_created : "12/12/12", ts_queued : "12/12/12",ts_started : "12/12/12",ts_ended : "12/12/12", },
			super_id : 1, task : "example_child_2", config : "config", status : "FAILED", input : "input", output : "40", ts_created : "12/12/12", ts_queued : "12/12/12",ts_started : "12/12/12",ts_ended : "12/12/12", }])
			.then(function(val) {
			console.log(val);
			console.log("OK");
			test.equals(true, true);
			test.done();
			}, 
			function(err) {
			console.log(err);
			console.log("Err");
			test.equals(false, true);
			test.done();
			}
		);
    },
     test_create_user_table : function(test) 
    {
		db.client_pau.schema.hasTable('user').then(function(exists) {
			if (!exists) 
			{
			return db.client_pau.schema.createTable('user', function (table) {
					table.increments('id').primary();
					table.string('email');
					table.string('name');
					table.string('surname');
					table.string('password');
					table.integer('permissions');
					table.boolean('validated');
			})
			.then(function(val) {
			console.log(val);
			console.log("OK table created");
			test.equals(true, true);
			test.done();
			}, 
			function(err) {
			console.log(err);
			console.log("Err");
			test.equals(false, true);
			test.done();
			}
		);
	}
		else { 
						test.equals(true, true);
						test.done();
				}
		});
	}
};

//TODO create table job,user and quality control
// 1: create a user
//2: create a simple tree job structure
//3: attach a quality control to the jobs
//4 test the rest apis
//5 test client side
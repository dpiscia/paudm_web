/*
 * Serve JSON to our AngularJS client
 */



/*
 * GET users listing.
 */
"use strict";
/* jshint -W098 */
/* jshint -W003 */
/* jshint -W009 */
/* jshint -W117 */

var q = require('q');
var db = require('../db');
var async = require('async');
var config = require('../config');
var query = require('../lib/query');
//jobs rest api

//parameter all defined the recursive level of query:0 no recursive level. 1: one depth level query indefinite: all avaialable depth query
module.exports.list = function(req, res)
	{
	console.log("param all "+req.params.all);
	console.log("param id "+req.params.id);
	query_post(req.params.id,req.params.all).then(function(val) 
		{
			res.send(val);
		});  
	};
//quality control rest api
module.exports.qc_list = function(req, res){
	console.log("qc api");
	query_qc_post(req.params.id).then (function(val) 
		{
		res.send(val);
		});
	};
	
module.exports.prod_list = function(req, res){
	
	query_prod().then (function(val) 
		{
		res.send(val);
		});
	};	
	
// select production jobs list 
function query_prod(id)
	{  
		var deferred = q.defer();
		db.client_pau("production").select('job_id').then  
		(
			function(resp) 
			{   
			console.log(resp);
			var job_ids = new Array();
			for (var i in resp) {
					
					job_ids.push(resp[i].job_id);				
					}
			        db.client_job("job").select().whereIn('id',job_ids).then(
			        function(resp) {
			        console.log(resp);
			        deferred.resolve(resp);
			        })
				
			}, 
			function(err) 
			{
				console.log(err.message);
			}
		); 
	return deferred.promise;
	}  	
	
// select operative quality_controls as a funciton of job id
function query_qc_post(id)
	{  
		var deferred = q.defer();
		db.client_pau("quality_control").select().where('job_id',id).andWhere('ref', 'not like', 'general').then  
		(
			function(resp) 
			{
				console.log(resp);
				deferred.resolve(resp);
			}, 
			function(err) 
			{
				console.log(err.message);
			}
		); 
	return deferred.promise;
	}  

function query_post(id,all)
{  
	var deferred = q.defer();
	console.log("entra");
	if (id === undefined) 
	{	//select all job with super_id null
		db.client_job('job as p').select(db.client_job.raw('*, (select count(*)  from job a where a.super_id = p.id) as nbr')).whereNull('super_id').then
		(query.quality_control).then(deferred.resolve, console.log);	
	}
	else 
	{
		if (all === '1') 
		{	//select all job with one level depth for the given job id
			//if db backend is postgres query will be sql recursive enabled if sqlite the recursion is given at server level (it takes much more time)
			if (config.job.client === "pg")
			{
				console.log("all == 1");
				db.client_job.raw(query.recursive_query(id,1)).then
				( 
					function(resp) 
					{
						
						query.quality_control(resp.rows).then(deferred.resolve,console.log);
					}
				);
			}
			else
			{
				flat_tree_dict(id, 0,1, function (treeSet) 
				{
					console.log("lunghezza",treeSet.length);
					console.log("lunghezza",treeSet[0].id);
					query. quality_control(treeSet).then(deferred.resolve,console.log);
				});
			}

		}
		if (all === '0') 
		{   //select all job with zero level depth for the given job id
			db.client_job('job').where("id",id).select().then
			( query.quality_control).then(deferred.resolve, console.log);
		}
		if (all === 'All') 
		{  //select all job with infinite level depth for the given job id
			if (config.job.client === "pg")
			{
				
				db.client_job.raw(query.recursive_query(id,100)).then
				( 
					function(resp) 
					{
						
						query.quality_control(resp.rows).then(deferred.resolve,console.log);
						
					}
				);
			}
			else
			{
				query.flat_tree_dict(id, 0,100, function (treeSet) 
				{
					console.log("lunghezza",treeSet.length);
					console.log("lunghezza",treeSet[0].id);
					query.quality_control(treeSet).then(deferred.resolve,console.log);
					
				});
			}
		}

	}
return deferred.promise;
}
 

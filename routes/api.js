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
//jobs rest api

//parameter all defined the recursive level of query:0 no recursive level. 1: one depth level query indefinite: all avaialable depth query
exports.list = function(req, res)
	{
	console.log("param all "+req.params.all);
	console.log("param id "+req.params.id);
	query_post(req.params.id,req.params.all).then(function(val) 
		{
			res.send(val);
		});  
	};
//quality control rest api
exports.qc_list = function(req, res){
	debugger;
	console.log("qc api");
	query_qc_post(req.params.id).then (function(val) 
		{
		res.send(val);
		});
	};

function query_qc_post(id)
	{  
		var deferred = q.defer();
		db.client_pau("quality_control").select().where('job_id',id).then  
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
//select p.id , (select count(a.id) from job a where a.super_id = p.id) from job p
function query_post(id,all)
{  
	var deferred = q.defer();
	console.log("entra");
	if (id === undefined) 
	{
		db.client_job('job as p').select(db.client_job.raw('*, (select count(*)  from job a where a.super_id = p.id) as nbr')).whereNull('super_id').then
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
	}
	else 
	{
		if (all === '1') 
		{  
			if (false)
			{
				console.log(recursive_query(id,1));
				db.client_job.raw(recursive_query(id,1)).then
				( 
					function(resp) 
					{
						
						deferred.resolve(resp.rows);
					}, 
					function(err) 
					{
		  				console.log(err.message);
					}
				);
			}
			else
			{
				flat_tree_dict(id, 0,1, function (treeSet) 
				{
					console.log("lunghezza",treeSet.length);
					console.log("lunghezza",treeSet[0].id);
					deferred.resolve(treeSet);
				});
			}

		}
		if (all === '0') 
		{
			db.client_job('job').where("id",id).select().then
			( 
				function(resp) 
				{
					
					deferred.resolve(resp);
				}, 
				function(err) 
				{
	  				console.log(err.message);
				}
			);

		}
		if (all === undefined) 
		{  
			if (false)
			{
				console.log(recursive_query(id,100));
				db.client_job.raw(recursive_query(id,100)).then
				( 
					function(resp) 
					{
						
						deferred.resolve(resp.rows);
					}, 
					function(err) 
					{
		  				console.log(err.message);
					}
				);
			}
			else
			{
				flat_tree_dict(id, 0,100, function (treeSet) 
				{
					console.log("lunghezza",treeSet.length);
					console.log("lunghezza",treeSet[0].id);
					deferred.resolve(treeSet);
				});
			}
		}

	}
return deferred.promise;
}
 
function recursive_query(id,level) {
	return (/*jshint multistr: true */"with recursive t(level,nbr, super_id,id, task, status, config, input, output , ts_created, ts_started, ts_ended) as ( \
		select 0, (select count(*) as nbr from job a where a.super_id = p.id),  super_id,id, task, status, config, input, output , ts_created, ts_started, ts_ended from job p where p.id = "+id+" \
		union \
		select \
		level + 1, \
		(select count(*) as nbr from job a where a.super_id = p.id), \
			p.super_id, \
			p.id, \
			p.task, p.status, \
			p.config, \
			p.input, p.output, p.ts_created, p.ts_started, p.ts_ended	from \
			job p join t \
			on p.super_id = t.id  where level<="+level+"\
) select * from t   ;");	
}
/*jshint unused:true*/
function flat_tree_dict(root_job,level, level_set, callback)
{
	var treeSet = []; 
	console.log("inside flat_Tree ID"+ root_job);
	db.client_job('job as p').select(db.client_job.raw('*, (select count(*) from job a where a.super_id = p.id) as nbr')).where('id',root_job).then
	(
		function(resp) 
		{
			console.log(resp);
			treeSet.push(resp[0]); 
		}, 
		function(err) 
		{
			console.log(err.message);
		}
	); 
    ++level;
	console.log("level "+level);
	console.log("level_set "+level_set);
	db.client_job('job').where("super_id",root_job).select().then
			( 
				function(resp) 
				{
					function each(row, next) 
					{
						console.log("dentro each row "+level);
						if (level <= level_set){
							flat_tree_dict(row.id, level, level_set, function (subSet) {
							treeSet = treeSet.concat(subSet);
							next(null);
							});
						}
						else {next(null);}
					}
					function done() {
						console.log("1st callback");
						callback(treeSet);
				    }
					console.log("async call");
					async.forEachSeries(resp, each, done);
				}, 
				function(err) 
				{
	  				console.log(err.message);
				}
			);	

}


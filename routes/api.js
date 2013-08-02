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
var sqlite3 = require('sqlite3').verbose();
var db = require('../db');

var async = require('async');
exports.list = function(req, res){
console.log("param all "+req.params.all);
console.log("param id "+req.params.id);
query_post(req.params.id,req.params.all).then(function(val) {
  //console.log('Promise Resolved!', val);
	res.send(val);
});
  
};


function query(){  
	
	var deferred = q.defer();
	var db = new sqlite3.Database('/Users/dpiscia/.sqlite/prova.db');	
	db.all("SELECT *  FROM job where super_id is NULL", function(err, rows) {
		deferred.resolve(rows); }
	); 
	db.close();
	return deferred.promise;
	}
  
//select p.id , (select count(a.id) from job a where a.super_id = p.id) from job p
function query_post(id,all){  
var deferred = q.defer();
console.log("entra");
	if (id === undefined) {
	db.client.query("select * , (select count(*) as nbr from job a where a.super_id = p.id) from job p where p.super_id is NULL", function(err, result) {
    if(err) {	
		return console.error('error running query', err);
	}
		console.log(result.rows[0]);
		deferred.resolve(result.rows);     
	});
}
	else {
		if (all === undefined) {
			console.log(recursive_query(id,1));
			db.client.query(recursive_query(id,100), function(err, result) {
	if(err) {
		return console.error('error running query', err);
    }
	console.log(result.rows[0]);
	deferred.resolve(result.rows);     
});
}
	else {
		console.log(recursive_query(id,100));
		db.client.query(recursive_query(id,100), function(err, result) {
	if(err) {	
		return console.error('error running query', err);
	}
	deferred.resolve(result.rows);     
	});
/*console.log("nested")
flat_tree_dict(id, 0,100, function (treeSet) {
	console.log("lunghezza",treeSet.length);
	console.log("lunghezza",treeSet[0].id);
	deferred.resolve(treeSet);
});*/
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
function flat_tree_dict(root_job,level, level_set, callback){
	var treeSet = []; 
	console.log("inside flat_Tree ID"+ root_job);
	db.client.query("SELECT *  , (select count(*) as nbr from job a where a.super_id = p.id) FROM job p where p.id = $1 ",[root_job], function(err, result) {
	if(err) {
		return console.error('error running query', err);
	}
	console.log("before"+treeSet.length+" ID "+result.rows[0].id);
	treeSet.push(result.rows[0]);    
   });
    ++level;
	console.log("level "+level);
	console.log("level_set "+level_set);
    db.client.query("SELECT *  FROM job where super_id = $1 ",[root_job], function(err, result) {
	function each(row, next) {
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
	async.forEachSeries(result.rows, each, done);
	});
}


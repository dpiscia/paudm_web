var Knex  = require('knex');
var config = require('./config');

console.log("entre db connection");   
console.log("config is "+config.url_job);
   

module.exports.connectDatabase = function(callback){
if (config.job.client === "pg"){
	 
		Knex.job = Knex.initialize({
		  client: 'pg',
		  debug: true,
		  connection: {
    host     : config.job.host,
    user     : config.job.user,
    password : config.job.password,
    database : config.job.name,
    charset  : 'utf8',
		  }
		});
	module.exports.client_job = Knex.job;

}
else {
Knex.job = Knex.initialize({
		  client: 'sqlite3',
		  debug: true,
		  connection: {

    filename : '/Users/dpiscia/sqlite_db/prova_bt.db',

		  }
		});
	module.exports.client_job = Knex.job;
	
}
};

/**
* This is the description for my class.
*
* @class MyClass
* @constructor
*/
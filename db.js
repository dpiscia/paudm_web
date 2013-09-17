var Knex  = require('knex');
var config = require('./config');

console.log("entre db connection");   
console.log("config is "+config.url_job);
   

module.exports.connectDatabase = function(callback){
if (config.url_job.substring(0,6) == "postgr"){
	 
		Knex.job = Knex.initialize({
		  client: 'pg',
		  debug: true,
		  connection: {
    host     : '127.0.0.1',
    user     : 'dpiscia',
    password : 'Iris82Da',
    database : 'paudm_post',
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
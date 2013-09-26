var Knex  = require('knex');


console.log("entre db connection");   

   

module.exports.connectDatabase = function(config){
console.log("initialize");
console.log("config is "+config.job.client);
if (config.job.client === "pg")
	{
	 
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
	
	 
	Knex.pau = Knex.initialize({
		client: 'pg',
		debug: true,
		connection: {
	host     : config.pau.host,
	user     : config.pau.user,
	password : config.pau.password,
	database : config.pau.name,
	charset  : 'utf8',
		}
	});
	module.exports.client_pau = Knex.pau;

}
else {
	Knex.job = Knex.initialize({
		client: 'sqlite3',
		debug: true,
		connection: {
			filename : config.job.name,
		}
	});
	module.exports.client_job = Knex.job;
	
	Knex.pau = Knex.initialize({
		client: 'sqlite3',
		debug: true,
		connection: 
		{
			filename : config.pau.name,
			}
		});
	module.exports.client_pau = Knex.pau;
	}
};

/**
* This is the description for my class.
*
* @class MyClass
* @constructor
*/
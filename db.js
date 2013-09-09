var pg = require ('pg');
var config = require('./config');

console.log("entre db connection");   
console.log("config is "+config.url);
   

module.exports.connectDatabase = function(callback){
var client = new pg.Client(config.url);
client.connect(function(err) {
  if(err){
     console.log(err);
     process.exit(1);
  }

  module.exports.client = client;
  callback();
});
};

/**
* This is the description for my class.
*
* @class MyClass
* @constructor
*/
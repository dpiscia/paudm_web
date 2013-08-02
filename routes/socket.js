/*
 * Serve content over a socket
 */
var db = require('../db');
module.exports = function (socket) {
	db.client.on('notification', function(data) {
	console.log(data);
	var id = data.payload.split(',')[2];
    var type_op = data.payload.split(',')[0];
	if (type_op === "DELETE") { 
	socket.emit('onJobDeleted', id);
	}
	else if (type_op === "INSERT") { 
		db.client.query("SELECT *  FROM job where id = $1 ",[id], function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
				socket.emit('onJobCreated', result.rows[0]);	
		});
		}
		else if (type_op === "UPDATE") { 
			db.client.query("SELECT *  FROM job where id = $1 ",[id], function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			socket.emit('onJobModified', result.rows[0]);
			});
		}				
	});
	db.client.query("LISTEN watchers");
	console.log("listening to channel watchers");
//handle disconnections
socket.once('disconnect', function(){
	console.log("disocnnect ");
	socket.disconnect(true);
	});
};



var base = require('./db.js');

function handlers(config) {
	var db = base(config); // {realredis} or {fakeredis}
	return {
		'home' : function (request, reply){
			reply.file('./public/index.html');
		},
		'addToSet' : function(request, reply) {
			var person = 'victoria';
			db.addToSet('teacher', person, function(err, data) {
				console.log(data); //result from redis
				if(err){
					console.log('error: ' + err);
					reply('error: ' + err);
				} else if (data === 0){
					console.log(person + ' already exists in ' + 'teacher');
					reply(person + ' already exists in ' + 'teacher');
				} else { // data === 1
					console.log(person + ' was added to ' + 'teacher');
					reply(person + ' was added to ' + 'teacher');
				}
			});
		},
		'removeFromSet' : function(request, reply) {
			var person = 'victoria';
			db.removeFromSet('teacher', person, function(err, data) {
				console.log(data); //result from redis
				if(err){
					reply('error: ' + err);
				} else if (data === 0){
					console.log('couldn\'t find ' + person + ' in ' + 'teacher');
					reply('couldn\'t find ' + person + ' in ' + 'teacher');
				} else { // data === 1
					console.log(person + ' was successfully removed from ' + 'teacher');
					reply(person + ' was successfully removed from ' + 'teacher');
				}
			});
		},
		'addHash' : function (request, reply){
			var hashname = 'hash1';
			var key = 'key1';
			var value = 'value1';
			db.addHash(hashname, key, value, function(err, data) {
				if (err) {
					reply("Error: " + err);
				} else if(data === 0) {
					console.log(data);
					reply(hashname + " already exists");
				} else {
					console.log(data);
					reply(hashname + " : " + key + " value " + value + " added");
				}
			});
		},
		'getAllKeysFromHash' : function (request, reply){
			db.getAllKeysFromHash('hash1', function(err, data) {
				if (err) {
					console.log(err);
					reply("Error: " + err);
				} else {
					console.log(data);
					reply("keys from hash: " + data);
				}
			});
		},
	};
}
module.exports = handlers; // exported to routes

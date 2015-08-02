var base = require('./db.js');

function handlers(config) {
	var client = base(config); // {realredis} or {fakeredis}

	return {
		'home' : function (request, reply){
			reply.file('./public/views/landing.html');
		},
		'studentdash' : function (request, reply){
			reply.file('./public/views/studentdashboard.html');
		},
		'teacherdash' : function (request, reply){
			reply.file('./public/views/teacherdashboard.html');
		},
		'classes' : function (request, reply){
			reply.file('./public/views/teacherclasses.html');
		},
		'students' : function (request, reply){
			reply.file('./public/views/teacherstudents.html');
		},
		'studentdiscussion' : function (request, reply){
			reply.file('./public/views/studentdiscussion.html');
		},
		'teacherdiscussion' : function (request, reply){
			reply.file('./public/views/teacherdiscussion.html');
		},
		'setassignment' : function (request, reply){
			reply.file('./public/views/setassignment.html');
		},
		'addToSet' : function(request, reply) {
			var setKey = 'teacher',
				setMember = 'victoria';
			client.sadd(setKey, setMember, function(err, data) {
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
				client.quit();
			});
		},
		'removeFromSet' : function(request, reply) {
			var setKey = 'teacher',
				setMember = 'victoria';
			client.srem(setKey, setMember, function(err, data) {
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
				client.quit();
			});
		},
		'addHash' : function (request, reply){
			var hashname = 'hash1';
			var key = 'key1';
			var value = 'value1';
			client.hset(hashname, key, value, function(err, data){
				if (err) {
					reply("Error: " + err);
				} else if(data === 0) {
					console.log(hashname + " already exists");
					reply(hashname + " already exists");
				} else {
					console.log(hashname + " : " + key + " value " + value + " added");
					reply(hashname + " : " + key + " value " + value + " added");
				}
				client.quit();
			});
		},
		'getAllKeysFromHash' : function (request, reply){
			var hashname = 'hash1';
			client.hgetall(hashname, function(err, data){
				if (err) {
					console.log(err);
					reply("Error: " + err);
				} else {
					console.log("keys from hash: ", data);
					reply("keys from hash: " + data);
				}
				client.quit();
			});
		},
		'logMessage' : function(request, reply) {

		}
	};
}
module.exports = handlers; // exported to routes

var base = require('./db.js');

function handlers(config) {
	var db = base(config);
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
					console.log(hashname + " already exists");
					reply(hashname + " already exists");
				} else {
					console.log(hashname + " : " + key + " value " + value + " added");
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
					console.log("keys from hash: ", data);
					reply("keys from hash: " + data);
				}
			});
		},
	};
}
module.exports = handlers; // exported to routes

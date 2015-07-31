var base = require('./db.js');

function handlers(config) {
	var db = base(config); // {realredis} or {fakeredis}

	// var redisMethods = require('./redis_methods.js');
	return {
		'home' : function (request, reply){
			reply.file('./public/index.html');
		},
		'set' : function(request, reply) {
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
		'remove' : function(request, reply) {
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
		}
	};
}
module.exports = handlers; // exported to routes

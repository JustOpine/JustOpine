var db = require('./db.js');


function handlers(config) {
	var Model = db({connection: config.connection});

	// var redisMethods = require('./redis_methods.js');
	return {
		'home' : function (request, reply){
			reply.file('./public/index.html');
		},
		'addToSet' : function(request, reply) {
			var person = 'victoria';
			Model.addToSet('teacher', person, function(err, data) {
				console.log(err || data);
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
			Model.removeFromSet('teacher', person, function(err, data) {
				console.log("data is " + data);
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
		'doesKeyExistInDb' : function (request, reply){
			Model.doesKeyExistInDb('juergen', function(exists, added) {
				var result = exists || added;
				console.log(result);
				reply(result);
			});
		},
		'addHashToDb' : function (request, reply){
			Model.addHashToDb('hash1', 'key1', 'value1', function(message) {
				console.log(message);
				reply(message);
			});
		},
		'getAllKeysFromHash' : function (request, reply){
			Model.getAllKeysFromHash('hash1', function(data) {
				console.log(data);
				reply(data);
			});
		},
	};
}
module.exports = handlers; // exported to routes

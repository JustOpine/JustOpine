var db = require('./db.js');


function handlers(config) {
	var Model = db({connection: config.connection});

	// var redisMethods = require('./redis_methods.js');
	return {
		'home' : function (request, reply){
			reply.file('./public/index.html');
		},
		'redis' : function (request, reply){
			Model.doesKeyExistInDb('juergen', function(exists, added) {
				var result = exists || added;
				console.log(result);
				reply(result);
			});
		},
		'redis1' : function (request, reply){
			Model.addHashToDb('hash1', 'key1', 'value1', function(message) {
				console.log(message);
				reply(message);
			});
		},
		'redis2' : function (request, reply){
			Model.getAllKeysFromHash('hash1', function(data) {
				console.log(data);
				reply(data);
			});
		},
	};
}
module.exports = handlers; // exported to routes

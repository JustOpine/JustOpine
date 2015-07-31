var db = require('./db.js');


function handlers(config) {
	var Model = db({connection: config.connection});

	// var redisMethods = require('./redis_methods.js');
	return {
		'home' : function (request, reply){
			reply.file('./public/index.html');
		},
		'redis' : function (request, reply){
			Model.addUser('mina', function(exists, added) {
				var result = exists || added;
				console.log(result);
				reply(result);
			});
		}
	};
}
module.exports = handlers; // exported to routes

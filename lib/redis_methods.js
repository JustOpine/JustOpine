var base = require('./db.js');

function redis_methods (config){

	var client = base(config); // {realredis} or {fakeredis}

	return{
		'addToSet' : function(setName, key, callback) {
			client.sadd(setName, key, function(err, data) {
				if(err){
					//console.log(err);
					callback('error: ' + err);
				} else if (data === 0){
					callback(key + ' already exists in ' + setName);
				} else {
					callback(key + ' was added to ' + setName);
				}
			});
		},
		'removeFromSet' : function(setName, key, callback) {
			client.srem(setName, key, function(err, data) {
				if(err){
					callback('error: ' + err);
				} else if (data === 0){
					callback('couldn\'t find ' + key + ' in ' + setName);
				} else { // data === 1
					callback(key + ' was successfully removed from ' + setName);
				}
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
			});
		},
		'logMessage' : function(request, reply) {

		}
	};

}
module.exports = redis_methods;
var base = require('./db.js');
var bcrypt = require('bcrypt');

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
		genID : function (category ,callback) {
	        var id = Math.floor(100000 + Math.random() * 900000);
	        client.sismember(category, id, function(err, data) {
	            if (err){
	                console.log("error");
	                callback(err, null);
	            } else if (data === 1) { // if duplicate IDs
	                console.log(id + " exists already.  will regenerate recursively");
	                genID(category, callback);
	            } else {
	                console.log(data + ": is indeed a unique ID");
	                callback(null, id);
	            }
	        });
	    },
        cryptPass : function (data, id, callback) {
	        bcrypt.genSalt(10, function(err, salt) {
	        	if (err){
	                console.log("error");
	                callback(err, null);
	            } else {
		            bcrypt.hash(data.password, salt, function(err, passhash) {
		                if (err){
			                console.log("error");
			                callback(err, null);
	           			 } else {
	           			 	callback(null, passhash);
	           			 }
		            });
	        	}
	        });
   		 },
		'addHashBigObj' : function (hashname, data, passhash, callback){

			client.hmset(hashname,'firstname', data.firstname,'surname', data.surname,'username', data.username,'password', passhash, 'isTeacher', true, 'isAdmin', false,  function(err, data){
				if (err) {
					callback("Error: " + err);
				} else if(data === 0) {
					console.log(hashname + " already exists");
					callback(hashname + " already exists");
				} else {
					console.log(hashname + " added");
					callback(hashname + " added");
				}
			});
		},
		'addHash' : function (hashname, username, id, callback){
			client.hmset(hashname, username, id, function(err, data){
				if (err) {
					callback("Error: " + err);
				} else if(data === 0) {
					console.log(hashname + " already exists");
					callback(hashname + " already exists");
				} else {
					console.log(hashname + " added");
					callback(hashname + " added");
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
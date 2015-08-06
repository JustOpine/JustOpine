var client = require('./db.js');
var bcrypt = require('bcrypt');

module.exports = {
		generateID : function (category ,callback) {
	        var id = Math.floor(100000 + Math.random() * 900000);
	        client.sismember(category, id, function(err, data) {
	            if (err){
	                callback(err, null);
	            } else if (data === 1) { // if duplicate IDs
	                generateID(category, callback);
	            } else {
	                callback(null, id);
	            }
	        });
	    },
        encryptPassword : function (password, id, callback) {
	        bcrypt.genSalt(10, function(err, salt) {
	        	if (err){
	                callback(err, null);
	            } else {
		            bcrypt.hash(password, salt, function(err, passwordHash) {
		                if (err){
			                callback(err, null);
	           			 } else {
	           			 	callback(null, passwordHash);
	           			 }
		            });
	        	}
	        });
   		 },
		'createUserHash' : function (hashKey, newUserInfo, passwordHash, callback){
			client.hmset(hashKey,'firstname', newUserInfo.firstname,'surname',
					newUserInfo.surname,'username', newUserInfo.username,'password',
					passwordHash, 'isTeacher', newUserInfo.isTeacher, 'isAdmin', newUserInfo.isAdmin,  function(err, data){
				if (err) {
					callback(err, null);
				} else {
					callback(null, data);
				}
			});
		},
		'addToUserSet' : function(hashKey, username, userID, callback){
			client.hset(hashKey, username, userID, function(err, data){
				client.quit();
				callback(err, data);
			});

		},
		'addToLoginHash' : function(hashKey, username, userID, callback) {
			client.hset('login', userInfo.username, id, function(err, data) {
	            if(err){
	                callback(err, null);
	            } else {
					client.quit();
					callback(null, data);
				}
	        });
		}
	};

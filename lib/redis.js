module.exports = function() {
    'use strict';
    var redisModule = require('redis'),
        url = require('url'),
        client;

    client = redisModule.createClient(process.env.REDISPORT, process.env.REDISHOST);
    client.auth(process.env.REDISSECRET);

    client.on('error', function(err) {
        console.log('Redis error: ' + err);
    });

    return {
        addUserToDB: function(classAttributes, callback){
        //check for "username/ID"-hash in DB(, if it doesnt exist create it)
            client.exists("ListOfUsers", function(err, reply) {
            	if (err) {
            		console.log('Error ', err);
            		return;
            	} else {
            		//console.log("This is the reply from redis: ",reply);
            		if (reply === 0){
            			callback("cannot compute");
            		} else {
            			callback("it exists");
            		}
            	}
            });
        //check if username is taken, if it is return error
        //if not, create a username-ID key-value pair ( ID has to be a random unique ID, if ID is taken generate new one) and return ID
        //
        //create hash with role:ID, containing name, username, password, role,
        },
    };
};

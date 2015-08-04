var bcrypt = require('bcrypt');
var Basic = require('hapi-auth-basic');

module.exports = {
    toDB : function (deets, client, callback) {
        this.client = client;
        console.log(deets);
        console.log("meta.toDB");
        // generate id, check against existing

        this.genID(function (err, id) {
            if(err){
                // do something
                console.log(err);
            } else {
                console.log(this === global);
                this.cryptPass(deets, id, callback);
            }
        }.bind(this)); // binding have the same this as the parent function
    },
    genID : function (callback) {
        console.log("meta.genID");
        var id = Math.floor(100000 + Math.random() * 900000);
        this.client.sismember('teacher', id, function(err, data) {
            console.log(callback.toString());
            if (err){
                console.log("error");
                callback(err, null);
            } else if (data === 1) { // if duplicate IDs
                console.log(id + " exists already.  will regenerate recursively");
                this.genID(callback);
            } else {
                console.log(data + ": is indeed a unique ID");
                callback(null, id);
            }
        }.bind(this)); // binding have the same this as the parent function
    },
    cryptPass : function (deets, id, callback) {
        console.log("meta.cryptPass");
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(deets.password, salt, function(err, passhash) {
                // Store hash in your password DB.
                this.store(deets, passhash, id, function(err, verdict){
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        console.log(verdict);
                        callback(null, verdict);
                    }
                });
            }.bind(module.exports)); // binding have the same this as the parent function
        });
    },
    store : function (deets, passhash, id, callback) {
        var cred = {
            username: deets.username,
            'id': id,
        };
        console.log("meta.store");
        console.log('adding teacher to hash');
        var key = 'teacher:' + id;
        this.client.hmset(key, 'firstname', deets.firstname, 'surname', deets.surname, 'username', deets.username, 'password', passhash, function(err, data) {
            if(err){
                callback(err, null);
            }
        });
        console.log('adding teacher to teacher set');
        this.client.sadd('teacher', id, function(err, data) {
            if(err){
                callback(err, null);
            }
            console.log(err, data);
        });
        console.log('adding teacher to id/teacher hash');
        this.client.hset('teacher:login', deets.username, id, function(err, data) {
            if(err){
                callback(err, null);
            }
            console.log(err, data);
            this.client.quit();
        }.bind(this)); // binding have the same this as the parent function
        
        callback(null, JSON.stringify(cred));
    }
};

var bcrypt = require('bcrypt');
var client = require('./db.js');
/*
ADDS TEACHER TO DB.  would be similar action for pupil
*/

module.exports = {
    client: client,
    addPerson : function (userInfo, callback) {
        console.log(userInfo);
        // generate id, check against existing
        this.generateID(userInfo, function (err, id) {
            if(err){
                callback(err, null);
            } else {
                this.encryptPassword(userInfo, id, callback);
            }
        }.bind(this)); // binding have the same this as the parent function
    },
    generateID : function (userInfo, callback) {
        console.log("api.generateID");
        var id = Math.floor(100000 + Math.random() * 900000);
        this.client.sismember(userInfo.role, id, function(err, data) {
            if (err){
                callback(err, null);
            } else if (data === 1) { // if duplicate IDs
                console.log(id + " exists already.  will regenerate recursively");
                this.generateID(callback);
            } else {
                console.log(data + ": is indeed a unique ID");
                callback(null,id);
            }
        }.bind(this)); // binding have the same this as the parent function
    },
    encryptPassword : function (userInfo, id, callback) {
        console.log("api.encryptPassword");
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userInfo.password, salt, function(err, passHash) {
                // Store hash in your password DB.
                this.store(userInfo, passHash, id, function(err, verdict){
                    if (err) {
                        callback(err, null);
                    } else {
                        console.log("verdict", verdict);
                        callback(null, verdict);
                    }
                });
            }.bind(module.exports)); // binding have the same this as the parent function
        });
    },
    store : function (userInfo, passHash, id, callback) {
        var cred = {
            username: userInfo.username,
            'id': id,
        };
        console.log("api.store");
        console.log('adding person to their hash');
        var key = userInfo.role + ':' + id;
        // add user's hash info
        this.client.hmset(key, 'firstname', userInfo.firstname, 'surname', userInfo.surname,
                                'username', userInfo.username, 'password', passHash,
                                'isAdmin', userInfo.isAdmin, 'isTeacher', userInfo.isTeacher, function(err, data) {
            if(err){
                callback(err, null);
            }
        });
        console.log('adding person to their respective set');
        // add user to their respective set
        this.client.sadd(userInfo.role, id, function(err, data) {
            if(err){
                callback(err, null);
            }
        });
        console.log('adding person to their respective hash');
        // add user to login hash
        this.client.hset('login', userInfo.username, id, function(err, data) {
            if(err){
                callback(err, null);
            }
            this.client.quit();
        }.bind(this)); // binding have the same this as the parent function

        callback(null, JSON.stringify(cred));
    },
    addClass : function(teacherID, className, callback) {
        var setKey = teacherID + ":" + "class";
        this.generateID(setKey, function(err, classID){
            this.client.sadd(setKey, classID + ":" + className, function(err, data) {
                client.quit();
                if(err){
                    callback(err, null);
                } else if (data === 0){
                    callback(null, false);
                } else { // data === 1
                    console.log("classID: " + setKey);
                    callback(null, true);
                }
            }.bind(module.exports));
        }.bind(this));

    },
    getClasses : function(teacherID, callback) {
        var setKey = teacherID + ':' + 'class';
        this.client.smembers(setKey, function(err, data) {
            console.log(Array.isArray(data));
            var classArray = data.map(function(e){
                return e.substring(e.indexOf(':')+1);
            });
            callback(null, JSON.stringify(classArray));
        });
    }
};

var bcrypt = require('bcrypt');
var client = require('./db.js');

module.exports = {

    client: client,

    addPerson : function (userInfo, teacherID, callback) {

        // generate id, check against existing
        this.generateID(userInfo, function (err, id) {
            if(err){
                callback(err, null);
            } else {
                this.encryptPassword(userInfo, teacherID, id, callback);
            }
        }.bind(this)); // binding have the same this as the parent function
    },

    getPupils : function(teacherID, className, callback) {
        var setKey = teacherID + ':' + className + ':' + 'pupil';
        this.client.smembers(setKey, function(err, pupilKeysArray) {
            var client = (this.client);
            var pupilsData = [];
            var counter = 0;
            pupilKeysArray.forEach(function(pupilKey) {
                return client.hgetall(pupilKey, function(err, data) {
                    pupilsData.push(data);
                    if(++counter === pupilKeysArray.length) {
                        callback(null, pupilsData);
                    }
                });
            });
        }.bind(this));
    },

    addClass : function(teacherID, className, callback) {
        var setKey = teacherID + ":" + "class";
        this.client.sadd(setKey, teacherID + ":" + className, function(err, data) {
            if(err){
                callback(err, null);
            } else if (data === 0){
                callback(null, false);
            } else { // data === 1
                console.log("classID: " + setKey);
                callback(null, true);
            }
        }.bind(this));

    },

    getClasses : function(teacherID, callback) {
        var setKey = teacherID + ':' + 'class';
        this.client.smembers(setKey, function(err, data) {
            if(err){
                callback(err, null);
            } else {
                callback(null, data);

            }
        }.bind(this));
    },

    generateID : function (userInfo, callback) {
        var id = Math.floor(100000 + Math.random() * 900000);
        this.client.sismember(userInfo.role, id, function(err, data) {
            if (err){
                callback(err, null);
            } else if (data === 1) { // if duplicate IDs
                this.generateID(callback);
            } else {
                callback(null,id);
            }
        }.bind(this)); // binding have the same this as the parent function
    },

    encryptPassword : function (userInfo, teacherID, id, callback) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userInfo.password, salt, function(err, passHash) {
                // Store hash in your password DB.
                this.store(userInfo, teacherID, passHash, id, function(err, verdict){
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, verdict);
                    }
                });
            }.bind(module.exports)); // binding has the same "this" as the parent function
        });
    },

    store : function (userInfo, teacherID, passHash, id, callback) {
        console.log(userInfo.nameOfClass);
        // set users's key
        var key = (teacherID) + ':' + id;

        console.log(key);

        // add user's info to a hash
        for (var objKey in userInfo) {
            if (objKey === 'password'){
                this.client.hset(key, 'password', passHash, function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("hash added successfully");
                    }
                });
            } else {
                console.log(userInfo[objKey]);
                this.client.hset(key, objKey, userInfo[objKey]);
            }
        }

        // add user to their class set
        var cred = {
            'username' : userInfo.username,
            'firstname' : userInfo.firstname,
            'surname' : userInfo.surname
        };

        console.log(teacherID + ':' + userInfo.nameOfClass + ':pupil');

        this.client.sadd(( teacherID + ':' + userInfo.nameOfClass + ':pupil'), teacherID + ':' + id, function(err, data) {
            if(err){
                callback(err, null);
            } else {
                console.log("successfully added to class set");
            }
        });

        // add user to login hash
        this.client.hset('login', userInfo.username, id, function(err, data) {
            if(err){
                callback(err, null);
            }
            // this.client.quit();
        }.bind(this)); // binding has the same "this" as the parent function

        callback(null, JSON.stringify(cred));
    }

};

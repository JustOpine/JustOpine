var bcrypt = require('bcrypt');
var client = require('./db.js');

module.exports = {

    client: client,

    addPerson : function (userInfo, teacherID, className, callback) {

        userInfo.teacherID = teacherID;
        userInfo.className = className;

        // generate id, check against existing
        this.generateID(userInfo, function (err, id) {
            if(err){
                callback(err, null);
            } else {
                this.encryptPassword(userInfo, id, callback);
            }
        }.bind(this)); // binding have the same this as the parent function
    },

    getPupils : function(teacherID, className, callback) {
        var setKey = teacherID + ':' + className + ':' + 'pupil';
        this.client.smembers(setKey, function(err, classArray) {
            var pupils = classArray.map(function(pupilKey){
                this.client.hgetall(pupilKey, function(err, data) {
                    console.log(data);
                    return data;
                }.bind(module.exports));
            });
            callback(null, pupils);
        }.bind(this));
    },

    addClass : function(teacherID, className, callback) {
        var setKey = teacherID + ":" + "class";
        console.log(teacherID);
        this.client.sadd(setKey, teacherID + ":" + className, function(err, data) {
            client.quit();
            if(err){
                callback(err, null);
            } else if (data === 0){
                callback(null, false);
            } else { // data === 1
                console.log("classID: " + setKey);
                callback(null, true);
            }
        });

    },

    getClasses : function(teacherID, callback) {
        var setKey = teacherID + ':' + 'class';
        this.client.smembers(setKey, function(err, data) {
            var classArray = data.map(function(e){
                return e.substring(e.indexOf(':')+1);
            });
            callback(null, JSON.stringify(classArray));
        });
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

    encryptPassword : function (userInfo, id, callback) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userInfo.password, salt, function(err, passHash) {
                // Store hash in your password DB.
                this.store(userInfo, passHash, id, function(err, verdict){
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, verdict);
                    }
                });
            }.bind(module.exports)); // binding has the same "this" as the parent function
        });
    },

    store : function (userInfo, passHash, id, callback) {

        // set users's key
        var key;
        if (userInfo.className) {
            key = userInfo.className + ':' + userInfo.teacherID + ':' + id;
            console.log(key);
        } else {
            key = userInfo.role + ":" + id;
            console.log(key);
        }

        // add user's hash info
        for (var objKey in userInfo) {
            if (objKey === 'password'){
                this.client.hset(key, 'password', passHash);
            } else {
                this.client.hset(key, objKey, userInfo[objKey]);
            }
        }

        // add user to their class set
        var cred = {
            'username' : userInfo.username,
            'firstname' : userInfo.firstname,
            'surname' : userInfo.surname
        };

        this.client.sadd((userInfo.role || userInfo.teacherID + ':' + userInfo.className + ':pupil'), id, function(err, data) {
            if(err){
                callback(err, null);
            }
        });

        // add user to login hash
        this.client.hset('login', userInfo.username, id, function(err, data) {
            if(err){
                callback(err, null);
            }
            this.client.quit();
        }.bind(this)); // binding has the same "this" as the parent function

        callback(null, JSON.stringify(cred));
    }

};

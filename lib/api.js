var bcrypt = require('bcrypt');
var client = require('./db.js');

module.exports = {

    client: client,

    addPerson : function (userInfo, callback) {
        console.log("in api.addPerson");
        // callback(null, userInfo);
        // var role = (userInfo.isTeacher ? 'teacher' : 'pupil');

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

    addAssignment : function (teacherID, newAssignmentInfo, callback) {

        var assignmentID;
        var setKey;
        var hashKey;

        this.generateID(newAssignmentInfo, function (err, id) {
            if(err){
                callback(err, null);
            } else {

                assignmentID = id;
                setKey = teacherID + ":" + newAssignmentInfo.class + ":assignment";
                hashKey = teacherID + ":" + newAssignmentInfo.class + ":" + assignmentID;

                // save key to a set of discussions

                this.client.sadd(setKey, hashKey, function(err, data) {
                    client.quit();
                    if(err){
                        callback(err, null);
                    } else if (data === 0){
                        callback(null, false);
                    } else { // data === 1
                        console.log("success");
                        callback(null, true);
                    }
                }.bind(this));

                // create discussion hash with assignment info

                this.client.hset(hashKey, 'key', hashKey);
                for (var objKey in newAssignmentInfo) {
                    console.log(objKey);
                    this.client.hset(hashKey, objKey, newAssignmentInfo[objKey]);
                }

            }
        }.bind(this));
    },

    getAssignment : function(teacherID, className, assignmentID, callback) {
        console.log("helllo I'm in api", teacherID, className, assignmentID);

        var hashKey = teacherID + ':' + className + ':' + assignmentID;
        console.log(hashKey);

        this.client.hgetall(hashKey, function(err, data) {
            console.log(data);
            callback(null, data);
        });

    },

    getClassAssignments : function (teacherID, className, callback) {
        console.log("handlers", className);
        var setKey = teacherID + ':' + className + ':' + 'assignment';
        this.client.smembers(setKey, function(err, assignmentKeys) {
            console.log(assignmentKeys);
            var client = (this.client);
            var assignmentData = [];
            var counter = 0;
            assignmentKeys.forEach(function(assignmentKey) {
                return client.hgetall(assignmentKey, function(err, data) {
                    assignmentData.push(data);
                    if(++counter === assignmentKeys.length) {
                        console.log(assignmentData);
                        callback(null, assignmentData);
                    }
                });
            });
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
                callback(null, id);
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
        // var key = (userInfo.role || userInfo.teacherID) + ':' + id;
        var key = (userInfo.isTeacher ? 'teacher' : (userInfo.teacherID + ':' + userInfo.className) ) + ':' + id;

        // save id in userInfo obj
        // key is either 'teacherID' or 'pupilID'
        if (userInfo.isTeacher){
          userInfo.teacherID = id;
        } else {
          userInfo.pupilID = id;
        }

        console.log(key);
        delete userInfo.password;
        this.client.sadd(key, JSON.stringify(userInfo), function(err, data){
            callback(null, data);
        });





        // // add user's info to a hash
        // for (var objKey in userInfo) {
        //     if (objKey === 'password'){
        //         this.client.hset(key, 'password', passHash, function(err, data) {
        //             if (err) {
        //                 console.log(err);
        //             } else {
        //                 console.log("hash added successfully");
        //             }
        //         });
        //     } else {
        //         this.client.hset(key, objKey, userInfo[objKey]);
        //     }
        // }
        // userInfo.password = passHash;
        //
        // // add user to their class set
        // var cred = {
        //     'username' : userInfo.username,
        //     'firstname' : userInfo.firstname,
        //     'surname' : userInfo.surname
        // };
        //
        // console.log(userInfo.teacherID + ':' + userInfo.className + ':pupil');
        //
        // this.client.sadd((userInfo.role || userInfo.teacherID + ':' + userInfo.className + ':pupil'), userInfo.teacherID + ':' + id, function(err, data) {
        //     if(err){
        //         callback(err, null);
        //     } else {
        //         console.log("successfully added to class set");
        //     }
        // });
        //
        // // add user to login hash
        // this.client.hset('login', userInfo.username, id, function(err, data) {
        //     if(err){
        //         callback(err, null);
        //     }
        //     this.client.quit();
        // }.bind(this)); // binding has the same "this" as the parent function
        //
        // callback(null, JSON.stringify(cred));
    }

};

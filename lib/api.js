var bcrypt = require('bcrypt');
var client = require('./db.js');
var intoDB = [];

module.exports = {

    client: client,

    addPerson : function (userInfo, callback) {
        console.log("in api.addPerson");

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
        var id = Math.floor(100000 + Math.random() * 900000);
        // must check if id exists general user list

        this.client.sismember('allUserIDs', id, function(err, data) {
            if (err){
                callback(err, null);
            } else if (data === 1) { // if duplicate IDs
                this.generateID(callback);
            } else {
                // if this is a pupil, concat the teacherID onto theirs
                // if(!userInfo.teacherID){
                //   id = userInfo.teacherID + ':' +  id;
                // }
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
      // store id in allUserIDs

        this.client.sadd('allUserIDs', id, function(err, data) {
            console.log('added ' + id + ' to ' + 'allUserIDs');
        });

        var finalID = (userInfo.isTeacher ? id : userInfo.teacherID + ':' + userInfo.className + ':' + id);

        // save id in userInfo obj - id saved under 'userInfo.userID'
        //(if pupil, obj will also contain 'userInfo.teacherID')

        // save encrypted password in userInfo
        userInfo.userID = finalID;
        userInfo.password = passHash;

        // add user to login hash
        // key: username, value: JSON (w/ userID, password, name etc)
        var loginInformation = JSON.stringify({'userID': finalID, 'password': passHash});
        this.client.hset('login', userInfo.username, loginInformation, function(err, data) {
            if(err){
                callback(err, null);
            }
            this.client.quit();
            console.log('added to login hash', userInfo.username, finalID);
        }.bind(this)); // binding has the same "this" as the parent function

        // remove password from userInfo obj (don't want it in the cookie)
        delete userInfo.password;

        // store userInfo in either teacher:[id] or [teacherid]:[id]
        // can't be classname because not available on login ** can store in login hash and have access**
        // this.client.sadd(key1, JSON.stringify(userInfo), function(err, data){
        //     console.log('successfully added user to SET', key1, JSON.stringify(userInfo));
        //     // callback(null, data);
        // });

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
        //
        // var cred = {
        //     'username' : userInfo.username,
        //     'firstname' : userInfo.firstname,
        //     'surname' : userInfo.surname
        // };
        //
        // console.log(userInfo.teacherID + ':' + userInfo.className + ':pupil');
        //

        /*
        teacher List--> teacher:[id]
        pupil --> [teacherid]:[className]:[id]
        classlist --> [teacherid]:[className]

        */

        // add user's id and information to their hash
          // if TEACHER
          // hashname: 'teachers'
          // if PUPIL
          // hashname: [teacherid]:[className]:class
        // key: their ID, value: JSON
        if(userInfo.className){
            key2 = userInfo.teacherID + ':' + userInfo.className + ':class';
        } else {
            key2 = 'teachers';
        }
        var userInformation = JSON.stringify(userInfo);
        this.client.hset(key2, finalID, userInformation, function(err, data) {
            if(err){
                callback(err, null);
            } else {
                console.log("successfully added to HASH", key2, finalID, ':', userInformation);
            }
        });

        callback(null, JSON.stringify(userInfo));
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

};

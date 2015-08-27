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

        if(userInfo.className){
            key2 = userInfo.teacherID + ':' + userInfo.className + ':pupil';
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
        var pupilsArray = [];
        var setKey = teacherID + ':' + className + ':' + 'pupil';
        // console.log('teacherid',teacherID);
        console.log('whole setKey',setKey);
        this.client.hgetall(setKey, function(err, pupils) {
            for (var key in pupils) {
                pupilsArray.push(pupils[key]);
            }
            var alphabeticalBySurname = pupilsArray.map(function(pupilObj) {
              return JSON.parse(pupilObj);
            })
            .sort(function(a, b) {
      				if (a.surname < b.surname) {return -1;}
      				else if (a.surname > b.surname){return 1;}
      				else {return 0;}
      			});
            callback(null, alphabeticalBySurname);
        });
    },

    addClass : function(teacherID, className, callback) {
        var setKey = teacherID + ":" + "class";
        this.client.sadd(setKey, className, function(err, data) {
            if(err){
                callback(err, null);
            } else if (data === 0){
                callback(null, false);
            } else { // data === 1
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
                // setKey = teacherID + ":" + newAssignmentInfo.class + ":assignment";
                // hashKey = teacherID + ":" + newAssignmentInfo.class + ":" + assignmentID;

                // save key to a set of discussions
                setKey = 'someClassID';
                hashKey = 'someAssignmentID';
                this.client.hset(setKey, hashKey, JSON.stringify(newAssignmentInfo), function(err, data) {
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

                // this.client.hset(hashKey, 'key', hashKey);
                // for (var objKey in newAssignmentInfo) {
                //     console.log(objKey);
                //     this.client.hset(hashKey, objKey, newAssignmentInfo[objKey]);
                // }

            }
        }.bind(this));
    },

    getAssignment : function(teacherID, className, assignmentID, callback) {
        var hashKey = teacherID + ':' + className + ':' + assignmentID;
        console.log(hashKey);

        this.client.hgetall(hashKey, function(err, data) {
            callback(null, data);
        });

    },

    getAssignmentsForAllClasses : function (teacherID, callback) {
        this.getClasses(teacherID, function(err, classesArray) {
            var responseData = [];
            var counter = 0;

            classesArray.forEach(function(e) {
                var setKey = teacherID + ':' + e + ':' + 'assignment';
                // console.log(setKey);
                return client.hgetall(setKey, function(err, data) {
                    for (var key in data){
                        console.log(data[key]);
                        responseData.push(JSON.parse(data[key]));
                        // console.log(counter);

                    }
                    if(++counter === classesArray.length) {

                        // console.log('responseData', responseData);
                        callback(null, responseData);
                    }

                });
            });
        }.bind(this));
    },

    addResponse : function (timestamp, className, assignmentID, response, teacherID, callback) {
        var responseID;
        var setKey;
        var hashKey;

        this.generateID(response, function (err, id) {
            if(err){
                callback(err, null);
            } else {

                responseID = id;
                setKey = teacherID + ":" + className + ":" + assignmentID + ":reply";
                hashKey = teacherID + ":" + className + ":" + assignmentID  + ":" + responseID;

                // save key to a set of discussions

                this.client.zadd(setKey, Number(timestamp), hashKey, function(err, data) {
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
                this.client.hset(hashKey, 'time', timestamp);
                this.client.hset(hashKey, 'teacher', teacherID);
                for (var objKey in response) {
                    this.client.hset(hashKey, objKey, response[objKey]);
                }

            }
        }.bind(this));
    },

    getResponseKeys : function (className, assignmentID, teacherID, callback) {
        var setKey = teacherID + ':' + className + ':' + assignmentID + ':reply';
        console.log(setKey);
        this.client.zrange(setKey, 0, -1, function(err, data) {
            console.log("zrange");
            if(err){
                console.log(err);
                callback(err, null);
            } else {
                console.log("responses", data);
                callback(null, data);
            }
        }.bind(this));
    },

    getResponseInfo : function (responseKeys, callback) {
        console.log("here are the keys", responseKeys);
        var client = (this.client);
        var responseData = [];
        var counter = 0;
        responseKeys.forEach(function(responseKey) {
            return client.hgetall(responseKey, function(err, data) {
                responseData.push(data);
                if(++counter === responseKeys.length) {
                    console.log(responseData);
                    callback(null, responseData);
                }
            });
        }.bind(this));

    },
};

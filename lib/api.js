var bcrypt = require('bcrypt');
var client = require('./db.js');

module.exports = {

    client: client,

    addPerson : function (userInfo, callback) {
        // calls api.generateID
        this.generateID(userInfo, function (err, id) {
            if(err){
                callback(err, null);
            } else {
                // calls api.encryptPassword
                this.encryptPassword(userInfo, id, callback);
            }
        }.bind(this));
    },

    generateID : function (userInfo, callback) {
        var id = Math.floor(100000 + Math.random() * 900000);

        this.client.sismember('allUserIDs', id, function(err, data) {
            if (err){
                callback(err, null);
            } else if (data === 1) { // if duplicate IDs
                this.generateID(userInfo, callback);
            } else {
                callback(null, id);
            }
        }.bind(this));
    },

    encryptPassword : function (userInfo, id, callback) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userInfo.password, salt, function(err, passHash) {
                this.store(userInfo, passHash, id, function(err, userInfo){
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, userInfo);
                    }
                });
            }.bind(module.exports));
        });
    },

    store : function (userInfo, passHash, id, callback) {

        var finalID = (userInfo.isTeacher ? id : userInfo.teacherID + ':' + userInfo.className + ':' + id);
        userInfo.userID = finalID;
        userInfo.password = passHash;

        var userInformation = JSON.stringify(userInfo);
        var loginInformation = JSON.stringify({'userID': finalID, 'password': passHash});

        if(userInfo.className){
          key2 = userInfo.teacherID + ':' + userInfo.className + ':pupil';
        } else {
          key2 = 'teachers';
        }

        client.sadd('allUserIDs', id, function(err, data) {
            if(err){
                callback("error in sadd: " + err, null);
            } else {
                client.hmset('login', userInfo.username, loginInformation, function(err, data) {
                    if(err){
                        callback("error in hset with login: " + err, null);
                    } else {
                        delete userInfo.password;
                        client.hmset(key2, finalID, userInformation, function(err, data) {
                            if(err){
                                callback("error in hset with key2: " + err, null);
                            } else {
                                callback(null, "UI" + JSON.stringify(userInfo));
                            }
                        });
                    }
                });
            }
        });

    },

    getPupils : function(teacherID, className, callback) {
        var pupilsArray = [];
        var hashKey = teacherID + ':' + className + ':' + 'pupil';
        this.client.hgetall(hashKey, function(err, pupils) {
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
            } else {
                callback(null, true);
            }
        }.bind(this));

    },

    getClasses : function(teacherID, callback) {
        var setKey = teacherID + ':' + 'class';
        client.smembers(setKey, function(err, data) {
            if(err){
                callback(err, null);
            } else {
                var sorted = data.sort(function(a, b) {
                    if(parseInt(a.match(/\d+/)[0]) > parseInt(b.match(/\d+/)[0]) ) {
                        return 1;
                    } else if (parseInt(a.match(/\d+/)[0]) > parseInt(b.match(/\d+/)[0]) ) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                callback(null, sorted);
            }
        });
    },

    addAssignment : function (teacherID, newAssignmentInfo, callback) {
        var setKey;

        this.generateID(newAssignmentInfo, function (err, assignmentID) {
            if(err){
                callback(err, null);
            } else {
                var hashKey = teacherID + ":" + newAssignmentInfo.class + ":assignment";
                newAssignmentInfo.assignmentID = assignmentID;
                newAssignmentInfo.timestamp = new Date();
                this.client.hmset(hashKey, assignmentID, JSON.stringify(newAssignmentInfo), function(err, data) {
                    if(err){
                        callback(err, null);
                    } else if (data === 0){
                        callback(null, false);
                    } else { // data === 1
                        callback(null, true);
                    }
                }.bind(this));

            }
        }.bind(this));
    },

    getAssignment : function(teacherID, className, assignmentID, callback) {
        var hashKey = teacherID + ':' + className + ':' + 'assignment';
        this.client.hgetall(hashKey, function(err, allClassAssignments) {
            var parsedAssignment = JSON.parse(allClassAssignments[assignmentID]);
            callback(null, parsedAssignment);
        });

    },

    getAssignmentsForOneClass : function (teacherID, className, callback) {
        var hashKey = teacherID + ':' + className + ':assignment';
        var responseData = [];
        client.hgetall(hashKey, function(err, data) {
            if (err) {
                callback(err, null);
            }

            for (var assignmentID in data){
                var parsedData = JSON.parse(data[assignmentID]);
                responseData.push(parsedData);
            }

            callback(null, responseData);
        });
    },

    getAssignmentsForAllClasses : function (teacherID, callback) {
        this.getClasses(teacherID, function(err, classesArray) {
            var responseData = [];
            var counter = 0;
            classesArray.forEach(function(e) {
                var hashKey = teacherID + ':' + e + ':' + 'assignment';
                return client.hgetall(hashKey, function(err, data) {
                    for (var assignmentID in data){
                        var parsedData = JSON.parse(data[assignmentID]);
                        responseData.push(parsedData);
                    }
                    if(++counter === classesArray.length) {
                        callback(null, responseData);
                    }

                });
            });
        });
    },

    addResponse : function (timestamp, className, assignmentID, response, teacherID, userName, callback) {
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

                this.client.zadd(setKey, Number(timestamp), hashKey, function(err, data) {
                    if(err){
                        callback(err, null);
                    } else if (data === 0){
                        callback(null, false);
                    } else {
                        callback(null, true);
                    }
                }.bind(this));

                // create discussion hash with assignment info
                this.client.hset(hashKey, 'key', hashKey);
                this.client.hset(hashKey, 'time', timestamp);
                this.client.hset(hashKey, 'teacher', teacherID);
                this.client.hset(hashKey, 'name', userName);
                for (var objKey in response) {
                    this.client.hset(hashKey, objKey, response[objKey]);
                }

            }
        }.bind(this));
    },

    getResponseKeys : function (className, assignmentID, teacherID, callback) {
        var setKey = teacherID + ':' + className + ':' + assignmentID + ':reply';
        this.client.zrange(setKey, 0, -1, function(err, data) {
            if(err){
                callback(err, null);
            } else {
                callback(null, data);
            }
        }.bind(this));
    },

    getResponseInfo : function (responseKeys, callback) {
        var client = (this.client);
        var responseData = [];
        var counter = 0;
        responseKeys.forEach(function(responseKey) {
            return client.hgetall(responseKey, function(err, data) {
                responseData.push(data);
                if(++counter === responseKeys.length) {
                    callback(null, responseData);
                }
            });
        }.bind(this));

    },
};

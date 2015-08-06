
var redisMethods = require('./redis-methods.js');

    module.exports ={
        'addUser': function (newUserInfo, callback){
            redisMethods.generateID(newUserInfo.role, function (err, userID) {
                redisMethods.encryptPassword(newUserInfo.password, userID, function(err, passwordHash){
                    var hashKey = newUserInfo.role + ":" + userID;

                    redisMethods.createUserHash(hashKey, newUserInfo, passwordHash, function(err, result){
                        if(err){
                            callback(err, null);
                        } else {
                            redisMethods.addToUserSet(newUserInfo.role, newUserInfo.username, userID, function(err, result){
                                if(err){
                                    callback(err, null);
                                } else {
                                    redisMethods.addToLoginHash('login', newUserInfo.username, userID, function(err, result){
                                        if(err){
                                            callback(err, null);
                                        } else {
                                            callback(null, "success");
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            });
        }
};

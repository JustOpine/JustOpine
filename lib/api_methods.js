function apiMethods (config) {

var redisMethods = require('./redis_methods.js')(config);

    return{
        'addTeacher': function (data, callback){
            redisMethods.genID(data.role, function (err, id) {
                redisMethods.cryptPass(data, id, function(err, passhash){
                    console.log(data);
                    var hashname = data.role + ":" + id;
                    var hashnameForLogin = data.role + ':login';

                    redisMethods.addHashBigObj(hashname, data, passhash, function(replyFromRedis){
                        console.log(replyFromRedis);
                    });
                    redisMethods.addToSet(data.role, id, function(replyFromRedis){
                        console.log(replyFromRedis);
                    });
                    redisMethods.addHash(hashnameForLogin, data.username, id, function(replyFromRedis){
                        console.log(replyFromRedis);
                    });
                });
            });
        },
        'registerClass': function(data, callback){
            redisMethods.removeFromSet(data.role, data.firstname, callback);    
        },
        'registerStudent': function(){

        },
        'registerDiscussion': function(){

        },
    };
}
module.exports = apiMethods; // exported to handlers
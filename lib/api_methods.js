function apiMethods (config) {

var redisMethods = require('./redis_methods.js')(config);

        //console.log(argument);
    return{
       addTeacher: function(data, callback){
            //console.log(redisMethods);
            redisMethods.addToSet(data.role, data.firstname, callback);
        },
        'registerClass': function(data, callback){
            redisMethods.removeFromSet(data.role, data.firstname, callback);    
        },
        'registerStudent': function(){

        },
        'registerDiscussion': function(){

        },
        'toDB': function (data, callback){
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
        }
    };
}
module.exports = apiMethods; // exported to handlers
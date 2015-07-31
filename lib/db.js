var db = function(config) {
    var redis = config.connection; // realredis or fakeredis

    var client = redis.createClient(process.env.REDISPORT, process.env.REDISHOST, {no_ready_check: true});
    client.auth(process.env.REDISSECRET);
    client.on('error', function(err) {
        console.log('Redis error: ' + err);
    });
    return {
        addToSet: function(setKey, setMember, callback) {
            client.sadd(setKey, setMember, function(err, data) {
                if(err){
                    callback(err, null);
                } else {
                    callback(null, data);
                }
            });
        },
        removeFromSet: function(setKey, setMember, callback) {
            client.srem(setKey, setMember, function(err, data) {
                if(err){
                    callback(err, null);
                } else {
                    callback(null, data);
                }
            });
        },
        addHash: function(hashname, key, value, callback){
            client.hset(hashname, key, value, function(err, data){
                if (err){
                    callback(err, null);
                }
                else {
                    callback(null, data);
                }
            });
        },
        getAllKeysFromHash: function(hashname, callback){
            client.hgetall(hashname, function(err, data){
                if (err){
                    callback(err, null);
                }
                else {
                    callback(null, data);
                }
            });
        }
    };
};



module.exports = db;

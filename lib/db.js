var db = function(config) {
    var redis = config.connection;

    var client = redis.createClient(process.env.REDISPORT, process.env.REDISHOST, {no_ready_check: true});
    client.auth(process.env.REDISSECRET);
    client.on('error', function(err) {
        console.log('Redis error: ' + err);
    });
    return {
        addToSet: function(setKey, setMember, callback) {
            client.sadd(setKey, setMember, function(err, data) {
                console.log(err, data);
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
        }
    };
};



module.exports = db;

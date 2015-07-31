var db = function(config) {
    var redis = config.connection;

    var client = redis.createClient(process.env.REDISPORT, process.env.REDISHOST, {no_ready_check: true});
    client.auth(process.env.REDISSECRET);
    client.on('error', function(err) {
        console.log('Redis error: ' + err);
    });
    return {
        doesKeyExistInDb: function(key, callback) {
            client.exists(key, function(err, data) {
                if (data === 1) {
                    callback(key + " exists", null);
                } else {
                    //should be a 
                    callback(null, key + " added");
                }
            });
            // console.log("result from entryExists " + this.entryExists(name));
            // if(this.entryExists(name) === 0){
            //     //add entry
            //     return name + ' doesn\'t exist.  adding to db';
            // } else {
            //     // return name + " already exists";
            //     return name + ' already exists';
            // }
        },
        addHashToDb: function(hashname, key, value, callback){
            client.hset(hashname, key, value, function(err, data){
                if (err) console.log(err)
                else if(data === 1){
                    callback(hashname + " : " + key + " value " + value + " added");                    
                } else {
                    callback(hashname + " : " + key + " value " + value + " updated");                    
                }
            });
        },
        getAllKeysFromHash: function(hashname, callback){
            client.hgetall(hashname, function(err, data){
                if (err) console.log(err)
                else {
                    callback(data);
                } 
            });
        },

    };
};



module.exports = db;

var db = function(config) {
    var redis = config.connection;

    var client = redis.createClient(process.env.REDISPORT, process.env.REDISHOST, {no_ready_check: true});
    client.auth(process.env.REDISSECRET);
    client.on('error', function(err) {
        console.log('Redis error: ' + err);
    });
    return {
        addUser: function(name, callback) {
            client.exists(name, function(err, data) {
                if (data === 1) {
                    callback(name + " exists", null);
                } else {
                    //insert(name, function(err, data) {
                    callback(null, name + " added");
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

    };
};



module.exports = db;

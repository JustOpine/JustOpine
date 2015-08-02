var db = function(config) {
    var redis = config.connection; // realredis or fakeredis
    console.log(config);
    var client = redis.createClient(process.env.REDISPORT, process.env.REDISHOST, {no_ready_check: true});
    client.auth(process.env.REDISSECRET);
    client.on('error', function(err) {
        console.log('Redis error: ' + err);
    });

    return client;

};



module.exports = db; // export to handlers

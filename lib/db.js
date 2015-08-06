/* istanbul ignore next */
var url = require('url');

var db = function(config) {
    var redis = config.connection; // realredis or fakeredis
    var redisURL = url.parse(process.env.REDISURL);
    var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
    client.auth(redisURL.auth.split(':')[1]);
    client.on('error', function(err) {
        console.log('Redis error: ' + err);
    });

    return client;

};



module.exports = db; // export to handlers

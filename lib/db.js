/* istanbul ignore next */
var url = require('url');

var db = function(config) {
    var redis = config.connection; // realredis or fakeredis
    var redisURL = 'redis://rediscloud:Sx2Papn9oBqNawhU@pub-redis-10066.us-east-1-3.6.ec2.redislabs.com:10066';
    var res = url.parse(redisURL);
    console.log(res);
    var client = redis.createClient(res.port, res.hostname, {no_ready_check: true});
    client.auth(res.auth.split(':')[1]);
    client.on('error', function(err) {
        console.log('Redis error: ' + err);
    });

    return client;

};



module.exports = db; // export to handlers

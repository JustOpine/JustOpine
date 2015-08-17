var url = require('url');
var redis = require('redis');
// var env = require('env2');
// console.log(env);
var redisURL = url.parse(process.env.REDISURL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(':')[1]);
client.on('error', function(err) {
    console.log('Redis error: ' + err);
});

module.exports = client; // export to handlers

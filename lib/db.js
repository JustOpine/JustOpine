var url = require('url');
var redis = require('redis');
var redisURL = url.parse(process.env.REDISURL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(':')[1]);
client.on('error', function(err) {
    console.log('Redis error: ' + err);
});

module.exports = client;

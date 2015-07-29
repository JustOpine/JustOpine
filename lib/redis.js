var redis = function() {
    'use strict';
    var redisModule = require('redis'),
        url = require('url'),
        client;

    client = redisModule.createClient(process.env.REDISPORT, process.env.REDISHOST);
    client.auth(process.env.REDISSECRET);

    client.on('error', function(err) {
        console.log('Redis error: ' + err);
    });
};

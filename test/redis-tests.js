// var test = require("tape");
// var url = require('url');
// var redis = require('redis');
// var handlers = require('../lib/db.js')(redis);
//
// console.log(handlers);
//
// // var client = redis.createClient(process.env.REDISPORT, process.env.REDISHOST, {no_ready_check: true});
// // client.auth(process.env.REDISSECRET);
// // client.on('error', function(err) {
// //     console.log('Redis error: ' + err);
// // });
//
// test("database is running", function (t) {
//     handlers.client.set('TEST', 'REMOTE');
//     handlers.client.get('TEST', function (err, reply) {
//         t.equal(reply, 'REMOTE', 'Database sets and gets correctly');
//         client.del('TEST');
//         client.end();
//         t.end();
//     });
// });
//
// test("addToSet works", function (t) {
//     handlers.addToSet('person', 'michelle');
//     client.sismember('person', 'michelle', function (err, reply) {
//         t.equal(reply, '1', 'addToSet works properly');
//         handlers.client.srem('person', 'michelle');
//         handlers.client.end();
//         t.end();
//     });
// });

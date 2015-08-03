// var assert  = require('assert');
// var serverConfig  = require('../lib/server_config.js');
// // var client = require('../lib/redis.js')();
// // var redisMethods = require('../lib/redis_methods.js');
// var test = require('tape');
// var db = require('../lib/db.js')(require('fakeredis'));
//
//
// server.inject({ method: 'GET', url: '/' }, function (res) {
// 	assert.equal(res.statusCode, '200');
// 	console.log('Status-Code: ' + res.statusCode + ' GENERIC CALL SUCCESS');
// 	// server.stop(); //modularize server.js: put methods in different files and only export the ones that dont start the server
// });
//
// console.log('# Check client address is correct');
// console.log("client address " + client.address);
// assert.equal(client.address, process.env.REDISHOST + ':' + process.env.REDISPORT, "client address is correct");
//
// console.log('# if teacher doesn\'t exist, create teacher hash');
// assert.equal(
// 	db.addUser('mina'), 'mina already exists', 'passed test'
// );
//
//
// // server.inject({method: 'GET', url: '/'}, function (res) {
// // 	console.log('# Check if index.html is served at \'/\' endpoint');
// // 	var location = res.result.indexOf("Just Opine");
// // 	assert.notEqual(location, -1, "Page titles match");
// //
// // 	server.stop();
// // });
// process.exit();

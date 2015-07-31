var assert   = require('assert');
var server   = require('../server.js');


	server.inject({ method: 'GET', url: '/' }, function (res) {
	 assert.equal(res.statusCode, '200');
	 console.log('Status-Code: ' + res.statusCode + ' GENERIC CALL SUCCESS');
	 server.stop(); //modularize server.js: put methods in different files and only export the ones that dont start the server
	 });

	// Shot.inject(server, { method: '', url: '/' }, function (res) {
	//  assert.equal(res.statusCode, '200');
	//  console.log('Status-Code: ' + res.statusCode + ' GENERIC CALL SUCCESS');
	//  });

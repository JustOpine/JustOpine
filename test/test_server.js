var Shot     = require('shot');
var assert   = require('assert');
var server   = require('../server.js');

	Shot.inject(server, { method: '', url: '/' }, function (res) {
	 assert.equal(res.statusCode, '200');
	 console.log('Status-Code: ' + res.statusCode + ' GENERIC CALL SUCCESS');
	 });
var env = require('env2')('env.json');
var server = require('./lib/server_config.js')();

server.start(function () {
	console.log("Running on port: ", process.env.PORT);
});

module.exports = server;

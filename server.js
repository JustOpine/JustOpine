var server = require('./lib/server_config.js')();

server.start(function () {
	console.log("Running on port: ", server.info.uri);
});

module.exports = server;

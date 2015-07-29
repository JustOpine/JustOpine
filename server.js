var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
	host: '0.0.0.0',
	port: Number(process.env.PORT)
});

server.route(require('./lib/routes.js'));

server.start(function () {
	// require('./lib/chat').init(server.listener, function(){
	// });
	console.log("Running on port: ", process.env.PORT);
});

module.exports = server;

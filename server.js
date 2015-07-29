var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
	host: '0.0.0.0',
	port: Number(process.env.PORT)
});

server.route([
	{ method: 'GET', path: '/', handler: { file: "public/index.html" } },
]);

server.start(function () {
	console.log('Listening on port ' + process.env.PORT);
});

module.exports = server;

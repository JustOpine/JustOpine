module.exports = function(){
	var Hapi = require('hapi');
	var server = new Hapi.Server();

	server.connection({
		host: '0.0.0.0',
		port: Number(process.env.PORT || 3000)
	});

	server.route(require('./routes.js'));
    return server;
}();

module.exports = function(){
	var Hapi = require('hapi');
	var server = new Hapi.Server();
	var redis = require('redis'); // real server uses real redis (obvs)

	server.connection({
		host: '0.0.0.0',
		port: Number(process.env.PORT || 3000)
	});

	server.route(require('./routes.js')({connection: redis}));
    return server;
};

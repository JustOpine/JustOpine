module.exports = function(){
	var Hapi = require('hapi');
	var server = new Hapi.Server();
	var redis = require('redis'); // real server uses real redis (obvs)
	var Cookie = require('hapi-auth-cookie');

	server.connection({
		host: '0.0.0.0',
		port: Number(process.env.PORT)
	});

	server.register(Cookie, function(err) {
		server.auth.strategy('session', 'cookie', {
			password: 'secret', //???????? 'random string to act as hash'
			cookie: 'justopine',
			redirectTo: false,
			isSecure: false,
			ttl: (24 * 60 * 60 * 1000 * 30)
		});
	});

	server.auth.default('session');

	server.route(require('./routes.js')({connection: redis}));
    return server;
};

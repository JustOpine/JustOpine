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
			cookie: 'sid-example',
			redirectTo: '/',
			isSecure: false
		});
	});

	server.route(require('./routes.js')({connection: redis}));
    return server;
};

module.exports = function(){
	var Hapi = require('hapi');
	var server = new Hapi.Server();
	var redis = require('redis');
	var Cookie = require('hapi-auth-cookie');
	// var env = require('env2')('../env.json');

	server.connection({
		host: '0.0.0.0',
		port: Number(process.env.PORT)
	});

	server.register(Cookie, function(err) {
		server.auth.strategy('session', 'cookie', {
			password: 'secret',
			cookie: 'justopine',
			redirectTo: '/',
			isSecure: false,
			ttl: (24 * 60 * 60 * 1000 * 30)
		});
	});

	server.views({
	    engines: {
	        html: {
				module: require('handlebars')
			}
	    }
	});
	server.auth.default('session');

	server.route(require('./routes.js'));
    return server;
};

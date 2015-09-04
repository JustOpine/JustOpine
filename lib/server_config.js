module.exports = function(){
	var Hapi = require("hapi");
	var server = new Hapi.Server();
	var redis = require("redis");
	var Cookie = require("hapi-auth-cookie");

	server.connection({
		host: "0.0.0.0",
		port: Number(process.env.PORT) || 3000
	});

	server.register(Cookie, function(err) {
		server.auth.strategy("session", "cookie", true, {
			password: "secret",
			cookie: "justopine",
			redirectTo: "/",
			isSecure: false,
			ttl: (24 * 60 * 60 * 1000 * 30)
		});
	});

	server.route(require("./routes.js"));
    return server;
};

var base = require('./db.js');
var url = require('url');
// var meta = require('./meta.js');
var auth = require('./auth.js');
var db = require('./DBmethods');

var handlers = {
	'home' : function (request, reply) {
		console.log(request.auth);
		if (request.auth.isAuthenticated) {
			if(request.auth.credentials.isAdmin) {
				reply('Hi, I\'m Edita');
			} else if(request.auth.credentials.isTeacher) {
				reply.redirect('/teacherdash');
			} else { // is a pupil
				reply.redirect('/studentdash');
			}
		} else { // not auth'd
			reply.redirect('/login');
		}
	},
	'login': function(request, reply){
		console.log(request.method);
		var failureMessage = '';
		var account = null;

		if (request.method === 'post') { // if trying to log in
			// check if username/password provided
			if (!request.payload.username || !request.payload.password) {
				failureMessage = 'Missing username or password';
			} else {
				auth(request, request.payload.username, request.payload.password, function(err, verdict, credentials) {
					if (!verdict){
						console.log('!verdict');
						failureMessage = 'Invalid username or password';
						return reply(failureMessage);
						// return reply('./public/views/landing.html');
						// handlebar w/ failureMessage
					} else {
						account = credentials;
						// console.log(account);
						request.auth.session.set(account);
						request.auth.session.ttl(43200000); // cookie is valid for 12 hours
						console.log('isAdmin: ', account.isAdmin);
						if(account.isAdmin){
							//reply.redirect('/editadash');
							reply("This would be Edita's page (once we build it)");
						} else if (account.isTeacher) {
							reply.redirect('/teacherdash');
							// various handlebars here
						} else {
							reply.redirect('/studentdash');
							// various handlebars here
						}
					}
				});
			}
		}
		if (request.method === 'get') { // if coming to page for 1st time
			return reply.file('./public/views/landing.html');
		}
	},
	'api' : function(request, reply) {
		var teacherID = request.auth.credentials.ID;
		if(request.method === 'get'){

		} else { // adding a new class
			console.log("teacherID in api ", teacherID);
			var className = request.payload.className.toUpperCase();
			db.addClass(teacherID, className, function(err, added) {
				if(err){
					console.log(err);
					reply(err);
				} else if(added){
					reply(className + " successfully added");
				} else {
					reply(className + " already exists");
				}
			});
		}
	},
	'logout' : function(request, reply) {
		console.log("ahoy!!");
		request.auth.session.clear();
		console.log(request.auth);
		reply.redirect('/');
		// reply.file('./public/views/landing.html');
	},
	'meta' : function(request, reply){  // FIX HACKYNESS
		if (request.payload){ // post req
			var userInfo = request.payload;
			meta.addPerson(userInfo, client, function (err, data) {
				console.log(err, data);
				console.log(data);
				reply(data);
				client.quit();
			});
		} else {
			reply.file('./public/views/reg-teacher.html');
		}
	},
};

module.exports = handlers; // exported to routes

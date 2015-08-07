var base = require('./db.js');
var url = require('url');
var api = require('./api.js');
var auth = require('./auth.js');


var handlers = {
	'home' : function (request, reply) {
		if (request.auth.isAuthenticated) {
			if(request.auth.credentials.isAdmin) {
				reply('Hi, I\'m Edita');
			} else if(request.auth.credentials.isTeacher) {
				reply.redirect('/teacherdash');
			} else { // is a pupil
				reply.redirect('/studentdash');
			}
		} else { // not auth'd
			return reply.file('./public/views/landing.html');
		}
	},
	'login': function(request, reply){
		// console.log(request.method);
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
	},
	'api' : function(request, reply) {
		var path = url.parse(request.url).pathname.split('/')[2];
		var teacherID = request.auth.credentials.ID;
		if (path === 'addClass') {

			var className = request.payload.className.toUpperCase();
			console.log(teacherID);
			console.log(className);
			api.addClass(teacherID, className, function(err, added){
				if(err){
					console.log(err);
				} else {
					reply('added ' + request.auth.credentials.firstname + '\'s class ' + className);
				}
			});
		} else if (path === 'newUser') {
			var newUserInfo = JSON.parse(request.payload);
			// apiMethods.addUser(newUserInfo, function(err, verdict){
			// 	reply(verdict);
			// });
			console.log(newUserInfo);
			api.addPerson(newUserInfo, function(err, data){
				console.log(data);
			});
		} else if (path === 'getClasses') {
			api.getClasses(teacherID, function(err, classes){
				console.log(classes);
				reply(classes);
			});
		}

		// var teacherID = request.auth.credentials.ID;
		// if(request.method === 'get'){
		//
		// } else { // adding a new class
		// 	console.log("teacherID in api ", teacherID);
		// 	var className = request.payload.className.toUpperCase();
		// 	db.addClass(teacherID, className, function(err, added) {
		// 		if(err){
		// 			console.log(err);
		// 			reply(err);
		// 		} else if(added){
		//			reply(className + " successfully added");
		// 		} else {
		// 			reply(className + " already exists");
		// 		}
		// 	});
		// }
	},
	'admin' : function (request, reply){

	},
	'logout' : function(request, reply) {
		console.log("ahoy!!");
		request.auth.session.clear();
		console.log(request.auth);
		reply.redirect('/');
		// reply.file('./public/views/landing.html');
	},
	'studentdash' : function (request, reply){
		reply.file('./public/views/studentdashboard.html');
	},
	'exampleApi' : function (request, reply){
		reply.file('./public/views/reg-teacher.html');
	},
	'teacherdash' : function (request, reply){
		reply.file('./public/views/teacherdashboard.html');
	},
	'classes' : function (request, reply){
		var teacherID = request.auth.credentials.ID;
		reply.file('./public/views/teacherclasses.html');

	},
	'students' : function (request, reply){
		reply.file('./public/views/teacherstudents.html');
	},
	'studentdiscussion' : function (request, reply){
		reply.file('./public/views/studentdiscussion.html');
	},
	'teacherdiscussion' : function (request, reply){
		reply.file('./public/views/teacherdiscussion.html');
	},
	'setassignment' : function (request, reply){
		reply.file('./public/views/setassignment.html');
	},
};

module.exports = handlers; // exported to routes


/* istanbul ignore next */

function handlers(config) {

var apiMethods = require('./api_methods.js')(config);
var auth = require('./auth.js');

	return {
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
			// console.log("request.payload ", request.payload);
			// console.log("request.auth ", request.auth);
			var failureMessage = '';
			var account = null;

			if (request.method === 'post') { // if trying to log in
				// check if username/password provided
				if (!request.payload.username || !request.payload.password) {
					failureMessage = 'Missing username or password';
				} else {
					auth(request, request.payload.username, request.payload.password, client, function(err, verdict, credentials) {
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
			var db = require('./dbMethods')(client);

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
		'api' : function (request, reply){
			var obj = JSON.parse(request.payload);
			apiMethods[obj.dbmethod](obj,function(arg){
				reply(arg);

			});
		},
		'studentdash' : function (request, reply){
		},
		'exampleApi' : function (request, reply){
			reply.file('./public/views/reg-teacher.html');
		},
		'teacherdash' : function (request, reply){
			reply.file('./public/views/teacherdashboard.html');
		},
		'classes' : function (request, reply){
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
}
module.exports = handlers; // exported to routes

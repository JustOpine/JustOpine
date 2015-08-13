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
				reply.redirect('/dash1');
			} else { // is a pupil
				reply.redirect('/dash2');
			}
		} else { // not auth'd
			return reply.file('./public/views/landing.html');
		}
	},
	'login': function(request, reply){
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
						request.auth.session.set(account);
						request.auth.session.ttl(43200000); // cookie is valid for 12 hours
						console.log('isAdmin: ', account.isAdmin);
						if(account.isAdmin){
							//reply.redirect('/editadash');
							reply("This would be Edita's page (once we build it)");
						} else if (account.isTeacher) {
							reply.redirect('/dash1');
							// various handlebars here
						} else {
							reply.redirect('/dash2');
							// various handlebars here
						}
					}
				});
			}
		}
	},
	'api' : function(request, reply) {

		var fullPathArray = url.parse(request.url).pathname.split('/');
		var path = fullPathArray[2];
		var teacherID = request.auth.credentials.ID;
		var className;

		if (path === 'addClass') {
			className = request.payload.className.toUpperCase();
			api.addClass(teacherID, className, function(err, added){
				if(err){
					console.log(err);
				} else {
					reply('added ' + request.auth.credentials.firstname + '\'s class ' + className);
				}
			});

		} else if (path === 'getClasses') {
			api.getClasses(teacherID, function(err, classes){
				reply(classes);
			});

		} else if (path === 'addPupil') {
			console.log(request);
			console.log(request.payload);
			var className = url.parse(request.url).pathname.split('/')[3];
			newPupilInfo = request.payload;
			api.addPerson(newPupilInfo, teacherID, className, function(err, data){
				console.log(data);
				reply(data);
			});

		} else if (path === 'getPupils') {
			className = url.parse(request.url).search.replace('?','');
			api.getPupils(teacherID, className, function(err, pupils) {
				console.log("in handlers", pupils);
				reply(pupils);
			});

		} else if (path === 'newUser') {
			var newUserInfo = JSON.parse(request.payload);
			console.log(newUserInfo);
			api.addPerson(newUserInfo, null, function(err, data) {
				console.log(data);
			});

		} else if (path === 'newAssignment') {
			var newAssignmentInfo = request.payload;
			console.log("info", newAssignmentInfo);
			api.addAssignment(teacherID, newAssignmentInfo, function(err, data) {
				console.log("success");
				console.log(data);
			})
		}
	},

	'dashboardPupil' : function (request, reply){
		reply.file('./public/views/dashboard-pupil.html');
	},
	'registrationTeacher' : function (request, reply){
		reply.file('./public/views/reg-teacher.html');
	},
	'dashboardTeacher' : function (request, reply){
		reply.file('./public/views/dashboard-teacher.html');
	},
	'classes' : function (request, reply){
		var teacherID = request.auth.credentials.ID;
		reply.file('./public/views/classes.html');

	},
	'pupils' : function (request, reply){
		reply.file('./public/views/pupils.html');
	},
	'assignmentPupil' : function (request, reply){
		reply.file('./public/views/assignment-pupil.html');
	},
	'assignmentTeacher' : function (request, reply){
		reply.file('./public/views/assignment-teacher.html');
	},
	'setAssignment' : function (request, reply){
		reply.file('./public/views/new-assignment.html');
	},
};

module.exports = handlers; // exported to routes

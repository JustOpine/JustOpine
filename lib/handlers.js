var base = require('./db.js');
var url = require('url');
var api = require('./api.js');
var auth = require('./auth.js');
var nameOfUser;
var fs = require('fs');


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
						console.log('out the other side: ', credentials);
						nameOfUser = credentials.firstname;
						// console.log(credentials.firstname);
						request.auth.session.set(credentials);
						request.auth.session.ttl(43200000); // cookie is valid for 12 hours
						console.log('isAdmin: ', credentials.isAdmin);
						if(credentials.isAdmin){
							//reply.redirect('/editadash');
							reply("This would be Edita's page (once we build it)");
						} else if (credentials.isTeacher) {
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
	'logout' :function(request, reply) {
		  request.auth.session.clear();
			console.log('logged out?');
			reply.redirect('/');
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
				console.log('this is getting classes');
				reply(classes);
			});

		} else if (path === 'addPupil') {
			console.log("incoming", request.payload);
			className = url.parse(request.url).pathname.split('/')[3];
			console.log(request.url.pathname);
			newPupilInfo = request.payload;
			newPupilInfo.className = className;
			// add the teacher's ID to the pupil's info
			newPupilInfo.teacherID = request.auth.credentials.userID;
			api.addPerson(newPupilInfo, function(err, data){
				console.log("outgoing", data);
				reply.redirect('/classes');
			});

		} else if (path === 'addTeacher') {
			console.log(request.payload);
			var newUserInfo = request.payload;
			console.log('in new userr');
			api.addPerson(newUserInfo, function(err, data) {
				console.log(data);
				reply.redirect('/');
			});

		} else if (path === 'getPupils') {
			className = url.parse(request.url).search.replace('?','');
			api.getPupils(teacherID, className, function(err, pupils) {
				console.log("in handlers", pupils);
				reply(pupils);
			});

		} else if (path === 'newAssignment') {
			var newAssignmentInfo = request.payload;
			console.log("info", newAssignmentInfo);
			api.addAssignment(teacherID, newAssignmentInfo, function(err, data) {
				console.log("success");
				console.log(data);
			});

		} else if (path === "getAssignment") {
			className = request.url.path.split('/')[3].toUpperCase();
			assignmentID = request.url.path.split('/')[4];
			api.getAssignment(teacherID, className, assignmentID, function(err, data) {
				console.log(data);
				reply(data);
			});

		} else if (path === "getClassAssignments") {
			className = request.url.path.split('/')[3].toUpperCase();
			console.log(className);
			api.getClassAssignments(teacherID, className, function(err, data) {
				console.log(data);
				reply(data);
			});
		}
	},
	'dashboardPupil' : function (request, reply){
		reply.view('./public/views/dashboard-pupil.html', {name: nameOfUser});
	},
	'registrationTeacher' : function (request, reply){
		reply.file('./public/views/reg-teacher.html');
	},
	'dashboardTeacher' : function (request, reply){
		reply.view('./public/views/dashboard-teacher.html', {name: nameOfUser});
		// reply.file('./public/views/dashboard-teacher.html');
	},
	'classes' : function (request, reply){
		var teacherID = request.auth.credentials.ID;

		fs.readFile('./public/views/classes.html', 'utf8', function (err,data) {

			if (err) {
				return console.log(err);
			} else {
				api.getClasses(teacherID, function(err, rawClasses){
	        var classes = rawClasses.map(function(e){
	            return e.substring(e.indexOf(':')+1);
	        });
					var assembledData = "<div id='appendhere'>";
			        //console.log(typeof classes);
			    for (var i=0; i<classes.length; i++) {
			        var className = classes[i];
			        assembledData += '<a href="/pupils/' + className + '"><div class="class-div" id="' + className + '">' + '<img class="class-icon" src="../static/public/images/assignment.png">' + '<h4>' + classes[i] + '</h4></div></a>';
			    }
					var assembledFile = data.replace('<div id="appendhere">', assembledData);

					reply(assembledFile);
				});
			}
		});
	},
	'pupils' : function (request, reply){
		console.log(request.url);
		// get pupils from db

		reply.view('./public/views/pupils.html', {name: nameOfUser});
	},
	'assignmentPupil' : function (request, reply){
		reply.view('./public/views/assignment-pupil.html', {name: nameOfUser});
	},
	'assignmentTeacher' : function (request, reply){
		reply.view('./public/views/assignment-teacher.html', {name: nameOfUser});
	},
	'setAssignment' : function (request, reply){
		reply.view('./public/views/new-assignment.html', {name: nameOfUser});
	},
};

module.exports = handlers; // exported to routes

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
		if (!request.payload || !request.payload.username || !request.payload.password) {
			reply.redirect('/');
		} else {
			auth(request, request.payload.username, request.payload.password, function(err, verdict, credentials) {
				if (!verdict){
					failureMessage = 'Invalid username or password';
					return reply(failureMessage);
				} else {
					nameOfUser = credentials.firstname;
					request.auth.session.set(credentials);
					request.auth.session.ttl(43200000); // cookie is valid for 12 hours
					if(credentials.isAdmin){
						//reply.redirect('/dash3');
						reply("This would be super-admin page (once we build it)");
					} else if (credentials.isTeacher) {
						reply.redirect('/dash1');
					} else {
						reply.redirect('/dash2');
					}
				}
			});
		}
	},
	'logout' :function(request, reply) {
		request.auth.session.clear();
		reply.redirect('/');
	},
	'api' : function(request, reply) {
		var fullPathArray = url.parse(request.url).pathname.split('/');
		var path = fullPathArray[2];
		// all users have their own userID.
		// additionally, pupils have their teacher's id (teacherID)
		var userID = request.auth.credentials.userID;
		var className;

		if (path === 'addClass') {
			className = request.payload.className.toUpperCase();
			api.addClass(userID, className, function(err, added){
				if(err){
					console.log(err);
					reply.redirect('/error');
				} else {
					reply.redirect('/classes');
				}
			});

		} else if (path === 'addPupil') {
			className = url.parse(request.url).pathname.split('/')[3];
			newPupilInfo = request.payload;
			newPupilInfo.className = className;
			newPupilInfo.teacherID = request.auth.credentials.userID;
			api.addPerson(newPupilInfo, function(err, data){
				if (err) {
					console.log(err);
					reply.redirect('/error');
				} else {
					reply(className);
				}
			});

		} else if (path === 'addTeacher') {
			var newUserInfo = request.payload;
			api.addPerson(newUserInfo, function(err, data){
				reply.redirect('/');
			});

		} else if (path === 'newAssignment') {
			var newAssignmentInfo = request.payload;
			api.addAssignment(userID, newAssignmentInfo, function(err, data) {
				if (err) {
					console.log(err);
					reply.redirect('/error');
				}
				console.log(data);
				reply.redirect('/dash1');
			});

		} else if (path === "getAssignment") {
			className = request.url.path.split('/')[3].toUpperCase();
			assignmentID = request.url.path.split('/')[4];
			var teacherID;

			if (request.auth.credentials.isTeacher) {
				teacherID = userID;
			} else {
				teacherID = request.auth.credentials.teacherID;
			}

			api.getAssignment(teacherID, className, assignmentID, function(err, data) {
				reply(data);
			});

		} else if (path === "getAssignmentsForClass") {
			className = request.url.path.split('/')[3].toUpperCase();
			api.getAssignmentsForClass(teacherID, className, function(err, data) {
				reply(data);
			});

		} else if (path === "addResponse") {
			var timestamp = new Date();
			className = request.info.referrer.split('/')[4];
			var assignmentID = request.info.referrer.split('/')[5];
			var response = request.payload;
			var teacherID;
			var userName = request.auth.credentials.firstname + ' ' + request.auth.credentials.surname;

			if (request.auth.credentials.isTeacher) {
				teacherID = userID;
			} else {
				teacherID = request.auth.credentials.teacherID;
			}

			api.addResponse(timestamp, className, assignmentID, response, teacherID, userName, function(err, data) {
				var indexOfPath = request.info.referrer.indexOf('/assignment');
				var path = request.info.referrer.substring(indexOfPath);
				reply.redirect(path);
			});

		} else if (path === "getResponses") {
			className = request.info.referrer.split('/')[4];
			var assignmentID = request.info.referrer.split('/')[5];

			api.getResponseKeys(className, assignmentID, userID, function(err, keys) {

				api.getResponseInfo(keys, function(err, data) {
					reply(data);
				});
			});
		}
	},
	'dashboardPupil' : function (request, reply){
		var assembledData = "";
		var teacherID = request.auth.credentials.teacherID;
		var className = request.auth.credentials.className;

		fs.readFile('./public/views/dashboard-pupil.html', 'utf8', function (err, data) {

			if (err) {
				console.log(err);
				reply.redirect('/error');

			} else {
				api.getAssignmentsForOneClass(teacherID, className, function(err, assignments){

					if (err) {
						console.log(err);
						reply.redirect('/error');
					}

					for (var key in assignments) {
						assembledData += '<a href="/assignment2/' + assignments[key].class + '/' + assignments[key].assignmentID + '"><div class="dashboard-assignment"><img class="class-icon" src="../static/public/images/assignment.png"><strong><p>' + assignments[key].class + '</p></strong><p>' + assignments[key].title + '</p></div></a>';
					}

					assembledFile = data.replace('<div id="appendhere">', assembledData);
					reply(assembledFile);

				});
			}
		});
	},
	'registrationTeacher' : function (request, reply){
		reply.file('./public/views/reg-teacher.html');
	},
	'dashboardTeacher' : function (request, reply){
		var assembledData = "";
		var teacherID = request.auth.credentials.userID;

		fs.readFile('./public/views/dashboard-teacher.html', 'utf8', function (err, data) {

			if (err) {
				console.log(err);
				reply.redirect('/error');

			} else {
				api.getAssignmentsForAllClasses(teacherID, function(err, assignments){

					if (err) {
						console.log(err);
						reply.redirect('/error');
					}

					for (var key in assignments) {
						assembledData += '<a href="/assignment1/' + assignments[key].class + '/' + assignments[key].assignmentID + '"><div class="dashboard-assignment"><img class="class-icon" src="../static/public/images/assignment.png"><strong><p>' + assignments[key].class + '</p></strong><p>' + assignments[key].title + '</p></div></a>';
					}

					assembledFile = data.replace('<div id="appendhere">', assembledData);
					reply(assembledFile);

				});
			}
		});
	},
	'classes' : function (request, reply){
		var teacherID = request.auth.credentials.userID;

		fs.readFile('./public/views/classes.html', 'utf8', function (err,data) {
			if (err) {
				console.log(err);
				reply.redirect('/error');

			} else {
				api.getClasses(teacherID, function(err, classes){
					var assembledData = "<div id='appendhere'>";

			    	for (var i=0; i<classes.length; i++) {
				        var className = classes[i];
				        assembledData += '<a href="/pupils?' + className + '"><div class="class-div" id="' + className + '">' + '<img class="class-icon" src="../static/public/images/assignment.png">' + '<h4>' + classes[i] + '</h4></div></a>';
			    	}

					var assembledFile = data.replace('<div id="appendhere">', assembledData);
					reply(assembledFile);
				});
			}
		});
	},
	'pupils' : function (request, reply){
		fs.readFile('./public/views/pupils.html', 'utf8', function (err,data) {
			if (err) {
				console.log(err);
				reply.redirect('/error');
			} else {
				className = url.parse(request.url).search.replace('?','');
				var userID = request.auth.credentials.userID;

				api.getPupils(userID, className, function(err, pupils) {
					var pupilList = '';
					for (var i = 0; i < pupils.length; i++){
						pupilList += '<td><img class="student-icon" src="../static/public/images/face.png"></td>' + '<td>' + pupils[i].surname + '</td><td>' + pupils[i].firstname + '</td><td>' + pupils[i].level + '</td></tr>';
					}

					var assembledFile = data.replace('<tr id="appendhere"></tr>', pupilList);
					reply(assembledFile);
				});
			}
		});

	},
	'assignmentPupil' : function (request, reply){
		reply.view('./public/views/assignment-pupil.html');
	},
	'assignmentTeacher' : function (request, reply){
		reply.view('./public/views/assignment-teacher.html');
	},
	'setAssignment' : function (request, reply){
		fs.readFile('./public/views/new-assignment.html', 'utf8', function (err, data) {
			if (err) {
				reply.redirect('/error');
			} else {
				var userID = request.auth.credentials.userID;
				api.getClasses(userID, function(err, classNames){
					var assembledData = '';
					for (var i = 0; i < classNames.length; i++) {
				        assembledData += "<option value='" + classNames[i] + "'>" + classNames[i] + "</option>";
				    }
					var assembledFile = data.replace('<option id="appendhere"></option>', assembledData);
					reply(assembledFile);
				});
			}
		});
	},
	'displayError' : function(request, reply) {
		reply.view('./public/views/error.html');
	}
};

module.exports = handlers; // exported to routes

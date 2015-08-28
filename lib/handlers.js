var base = require('./db.js');
var url = require('url');
var api = require('./api.js');
var auth = require('./auth.js');
var nameOfUser;
var fs = require('fs');


var handlers = {
	'test' : function(request, reply){
		api.getPupils('414744', '7E3', function( err, pupils ) {
			reply(pupils);
		});
	},
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
			console.log('logged out');
			reply.redirect('/');
	},
	'api' : function(request, reply) {

		var fullPathArray = url.parse(request.url).pathname.split('/');
		var path = fullPathArray[2];
		console.log("path", path);
		// all users have their own userID.
		// additionally, pupils will have their teacher's id (teacherID)
		var userID = request.auth.credentials.userID;
		var className;

		if (path === 'addClass') {
			className = request.payload.className.toUpperCase();
			api.addClass(userID, className, function(err, added){
				if(err){
					console.log(err);
				} else {
					reply.redirect('/classes');
				}
			});

		} else if (path === 'addPupil') {
			className = url.parse(request.url).pathname.split('/')[3];
			newPupilInfo = request.payload;
			newPupilInfo.className = className;
			// add the teacher's ID to the pupil's info
			newPupilInfo.teacherID = request.auth.credentials.userID;
			api.addPerson(newPupilInfo, function(err, data){
				reply(className);
			});

		} else if (path === 'addTeacher') {
			var newUserInfo = request.payload;
			api.addPerson(newUserInfo, function(err, data){
				reply.redirect('/');
			});

		} else if (path === 'newAssignment') {
			var newAssignmentInfo = request.payload;
			api.addAssignment(userID, newAssignmentInfo, function(err, data) {
				reply.redirect('/dash1');
			});

		} else if (path === "getAssignment") {
			className = request.url.path.split('/')[3].toUpperCase();
			assignmentID = request.url.path.split('/')[4];
			api.getAssignment(userID, className, assignmentID, function(err, data) {
				console.log('assignmentdata', data);
				reply(data);
			});

		} else if (path === "getAssignmentsForClass") {
			className = request.url.path.split('/')[3].toUpperCase();
			console.log(className);
			api.getAssignmentsForClass(teacherID, className, function(err, data) {
				reply(data);
			});

		} else if (path === "addResponse") {
			className = request.info.referrer.split('/')[4];
			var assignmentID = request.info.referrer.split('/')[5];
			var response = request.payload;
			var timestamp = new Date();
			api.addResponse(timestamp, className, assignmentID, response, userID, function(err, data) {
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
		// loading assignments could happen here (prevent two calls to server)
		reply.view('./public/views/dashboard-pupil.html', {name: nameOfUser});
	},
	'registrationTeacher' : function (request, reply){
		reply.file('./public/views/reg-teacher.html');
	},
	'dashboardTeacher' : function (request, reply){
		console.log("dashboardTeacher");
		var teacherID = request.auth.credentials.userID;
		var assembledData = "";
		fs.readFile('./public/views/dashboard-teacher.html', 'utf8', function (err, data) {
			if (err) {
				console.log("err", err);
				reply(err);
			} else {
				api.getAssignmentsForAllClasses(teacherID, function(err, assignments){
					if(err){
						reply(err);
					}
					for (var i = 0; i < assignments.length+1; i++){
						if (i === assignments.length){
							var assembledFile = data.replace('<div id="appendhere">', assembledData);
							reply(assembledFile);
							break;
						}
						else if(assignments[i]){
							for (var key in assignments[i]) {
								assembledData += '<a href="/assignment1/' + assignments[i][key].class + '/' + key + '"><div class="dashboard-assignment"><img class="class-icon" src="../static/public/images/assignment.png"><strong><p>' + assignments[i][key].class + '</p></strong><p>' + assignments[i][key].title + '</p></div></a>';
							}

						}
					}
				});
			}
		});
	},
	'classes' : function (request, reply){
		var teacherID = request.auth.credentials.userID;
		fs.readFile('./public/views/classes.html', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
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
		console.log('in handlers.pupils');
		// console.log('request.url',request.url);
		//CURRENTLY CLICKING ON CLASSNAME GETS YOU TO THIS ENDPOINT
		fs.readFile('./public/views/pupils.html', 'utf8', function (err,data) {
			if (err) {
				console.log(err);
			} else {
				console.log(url.parse(request.url));
				className = url.parse(request.url).search.replace('?','');
				console.log("after", className);
				var userID = request.auth.credentials.userID;
				api.getPupils(userID, className, function(err, pupils) {
					var pupilList = '';
					for (var i = 0; i < pupils.length; i++){
						pupilList += '<td><img class="student-icon" src="../static/public/images/face.png"></td>' + '<td>' + pupils[i].firstname + '</td><td>' + pupils[i].surname + '</td><td>' + pupils[i].level + '</td></tr>';
					}

					var assembledFile = data.replace('<tr id="appendhere"></tr>', pupilList);
					reply(assembledFile);
				});
			}
		});

	},
	'assignmentPupil' : function (request, reply){
		reply.view('./public/views/assignment-pupil.html', {name: nameOfUser});
	},
	'assignmentTeacher' : function (request, reply){
		reply.view('./public/views/assignment-teacher.html', {name: nameOfUser});
	},
	'setAssignment' : function (request, reply){
		var teacherID = request.auth.credentials.userID;
		fs.readFile('./public/views/new-assignment.html', 'utf8', function (err, data) {
			if (err) {
				return console.log(err);
			} else {
				api.getClasses(teacherID, function(err, classNames){
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
};

module.exports = handlers; // exported to routes

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
		// all users have their own userID.
		// additionally, pupils will have their teacher's id (teacherID)
		// var teacherID = request.auth.credentials.teacherID;
		var userID = request.auth.credentials.userID;
		var className;

		if (path === 'addClass') {
			className = request.payload.className.toUpperCase();
			api.addClass(userID, className, function(err, added){
				if(err){
					console.log(err);
				} else {
					reply('added ' + request.auth.credentials.firstname + '\'s class ' + className);
				}
			});

		} else if (path === 'getClasses') {
			// DOES THIS HAPPEN ANYMORE?
			// api.getClasses(userID, function(err, classes){
			// 	console.log('this is getting classes');
			// 	reply(classes);
			// });

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
				reply.redirect('/pupils');
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
			// DOES THIS HAPPEN ANYMORE???
			// console.log('in getPupils');
			// className = url.parse(request.url).search.replace('?','');
			//
			// // when adding a pupil, only the pupils list gets served, not the file...
			// // should be serving the data AND the file
			// api.getPupils(userID, className, function(err, pupils) {
			// 	console.log("in handlers", pupils);
			// 	reply(pupils);
			// });

		} else if (path === 'newAssignment') {
			var newAssignmentInfo = request.payload;
			console.log("info", newAssignmentInfo);
			api.addAssignment(userID, newAssignmentInfo, function(err, data) {
				console.log("success");
				console.log(data);
				reply(data);
			});

			// WILL ALMOST CERTAINLY BREAK.

		} else if (path === "getAssignment") {
			className = request.url.path.split('/')[3].toUpperCase();
			assignmentID = request.url.path.split('/')[4];
			api.getAssignment(teacherID, className, assignmentID, function(err, data) {
				reply(data);
			});

				// WILL ALMOST CERTAINLY BREAK.

		} else if (path === "getClassAssignments") {
			className = request.url.path.split('/')[3].toUpperCase();
			console.log(className);
			api.getClassAssignments(teacherID, className, function(err, data) {
				reply(data);
			});

		} else if (path === "addResponse") {
			className = request.info.referrer.split('/')[4];
			console.log(className, assignmentID);
			var assignmentID = request.info.referrer.split('/')[5];
			var response = request.payload;
			var timestamp = new Date();
			api.addResponse(timestamp, className, assignmentID, response, teacherID, function(err, data) {
				console.log(data);
				reply(data);
			});

		} else if (path === "getResponses") {
			className = request.info.referrer.split('/')[4];
			var assignmentID = request.info.referrer.split('/')[5];
			console.log(className, assignmentID);
			api.getResponseKeys(className, assignmentID, teacherID, function(err, keys) {
				api.getResponseInfo(keys, function(err, data) {
					console.log(data);
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
		// loading assignments could happen here (prevent two calls to server)
		reply.view('./public/views/dashboard-teacher.html', {name: nameOfUser});
	},
	'classes' : function (request, reply){
		var teacherID = request.auth.credentials.userID;
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
						  console.log('classes[i]',classes[i]);
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
		console.log('request.url',request.url);
		//CURRENTLY CLICKING ON CLASSNAME GETS YOU TO THIS ENDPOINT
		fs.readFile('./public/views/pupils.html', 'utf8', function (err,data) {
			if (err) {
				console.log(err);
			} else {
				className = url.parse(request.url).search.replace('?','');
				var userID = request.auth.credentials.userID;
				api.getPupils(userID, className, function(err, pupils) {
					console.log("in handlers", pupils);
					// pupils = JSON.parse(pupils);
					var pupilList = '';
					for (var i = 0; i < pupils.length; i++){
						// console.log('pupils[i]',pupils[i]);
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
		reply.view('./public/views/new-assignment.html', {name: nameOfUser});
	},
};

module.exports = handlers; // exported to routes

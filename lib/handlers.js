var url = require("url");
var api = require("./api.js");
var auth = require("./auth.js");
var fs = require("fs");
var moment = require("moment");

var handlers = {
	"home": function (request, reply) {
		if (request.auth.isAuthenticated) {
			if(request.auth.credentials.isTeacher) {
				reply.redirect("/dash1");
			} else {
				reply.redirect("/dash2");
			}
		} else {
			reply.file("./public/views/landing.html");
		}
	},
	"login": function(request, reply){
		if (!request.payload || !request.payload.username || !request.payload.password) {
			reply.file("./public/views/no-login-details.html");
		} else {
			auth(request, request.payload.username, request.payload.password, function(err, verdict, credentials) {
				if (!verdict){
					return reply.file("./public/views/login-error.html");
				} else {
					request.auth.session.set(credentials);
					request.auth.session.ttl(43200000);
					if (credentials.isTeacher) {
						reply.redirect("/dash1");
					} else {
						reply.redirect("/dash2");
					}
				}
			});
		}
	},
	"logout": function(request, reply) {
		request.auth.session.clear();
		reply.redirect("/");
	},
	"api": function(request, reply) {
		var fullPathArray = url.parse(request.url).pathname.split("/");
		var path = fullPathArray[2];

		if (path === "addTeacher") {
			var newUserInfo = request.payload;
			api.addPerson(newUserInfo, function(err, data){
				reply.file("./public/views/added-teacher.html");
			});
		} else {
			var userID = request.auth.credentials.userID;
			var className;

			if (path === "addClass") {
				className = request.payload.className.toUpperCase();
				api.addClass(userID, className, function(err, added){
					if(err){
						reply.redirect("/error");
					} else {
						reply.redirect("/classes");
					}
				});

			} else if (path === "addPupil") {
				var newPupilInfo = request.payload;
				className = url.parse(request.url).pathname.split("/")[3];
				newPupilInfo.className = className;
				newPupilInfo.teacherID = userID;
				api.addPerson(newPupilInfo, function(err, data){
					if (err) {
						reply.redirect("/error");
					} else {
						reply.redirect("/pupils?" + className);
					}
				});

			} else if (path === "newAssignment") {
				var newAssignmentInfo = request.payload;
				newAssignmentInfo.text = newAssignmentInfo.text.replace(/\r\n/g, '<br>');
				api.addAssignment(userID, newAssignmentInfo, function(err, data) {
					if (err) {
						reply.redirect("/error");
					} else {
						reply.redirect("/dash1");
					}
				});

			} else if (path === "getAssignment") {
				className = request.url.path.split("/")[3].toUpperCase();
				var assignmentID = request.url.path.split("/")[4];
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
				className = request.url.path.split("/")[3].toUpperCase();
				api.getAssignmentsForClass(teacherID, className, function(err, data) {
					reply(data);
				});

			} else if (path === "addResponse") {
				var response = request.payload;
				if (request.payload === null || !response.threeWords || !response.response){
					reply.file("./public/views/incomplete-response.html");
				} else {
					var timestamp = Date.now();
					className = request.info.referrer.split("/")[4];
					var assignmentID = request.info.referrer.split("/")[5];

					var userName = request.auth.credentials.firstname + " " + request.auth.credentials.surname;
					var teacherID;
					if (!request.auth.credentials.isTeacher) {
						teacherID = request.auth.credentials.teacherID;
					} else {
						teacherID = userID;
					}
					// filter out URLs
					response.response = response.response.replace(/\r\n/g, '<br>').replace(/(https?:\/\/)?www\S+/g, "<em>[URL blocked]</em>");

					var splitCondition = (response.threeWords.match(/\s+/) ? /\s+/ : ",");
					response.threeWords = response.threeWords.split(splitCondition).slice(0, 3).join(" ").replace(/,/g, "");
					api.addResponse(timestamp, className, assignmentID, response, userName, userID, teacherID, function(err, added) {


						if (!added){
							// load page that says "no duplicates allowed!"
							reply.file("./public/views/duplicate-response.html");
						} else {
							var indexOfPath = request.info.referrer.indexOf("/assignment");
							var path = request.info.referrer.substring(indexOfPath);
							reply.redirect(path);
						}
					});
				}

			} else if (path === "getResponses") {
				className = request.info.referrer.split("/")[4];
				var assignmentID = request.info.referrer.split("/")[5];
				var teacherID = request.auth.credentials.teacherID || request.auth.credentials.userID;
				api.getResponseKeys(className, assignmentID, teacherID, function(err, keys) {
					api.getResponseInfo(keys, function(err, data) {
						reply(data);
					});
				});
			}
		}

	},

	"dashboardPupil": function (request, reply){
		var assembledData = "";
		var assembledFile;
		var teacherID = request.auth.credentials.teacherID;
		var className = request.auth.credentials.className;

		fs.readFile("./public/views/dashboard-pupil.html", "utf8", function (err, data) {
			if (err) {
				reply.redirect("/error");
			} else {
				api.getAssignmentsForOneClass(teacherID, className, function(err, assignments){

					if (err) {
						reply.redirect("/error");
					} else {
						asssignments = assignments.reverse();
						for (var key in assignments) {
							var textExtract = assignments[key].text.split(/\s+/).slice(0,50).join(" ");

							assembledData += "<a href='/assignment2/" + assignments[key].class + "/" + assignments[key].assignmentID + "'><div class='dashboard-assignment'><div class='dashboard-image'><img src='" + assignments[key].image + "'></div><h2><img class='assignment-icon' src='/static/public/images/assignment.png'>" + assignments[key].title + "</h2><p>" + textExtract + "...</p><div class='tag'>" + assignments[key].class + "</div><div class='tag'>" + assignments[key].category + "</div></div></a>";
						}

						assembledFile = data.replace("<div id='appendhere'>", assembledData);
						reply(assembledFile);
					}
				});
			}
		});
	},
	"dashboardTeacher": function (request, reply){
		var assembledData = "";
		var assembledFile;
		var teacherID = request.auth.credentials.userID;
		fs.readFile("./public/views/dashboard-teacher.html", "utf8", function (err, data) {
			if (err) {
				reply.redirect("/error");
			} else {
				api.getAssignmentsForAllClasses(teacherID, function(err, assignments){
					if (err) {
						reply.redirect("/error");
					} else {
						assignments = assignments.sort(function(a, b) {
							return a.timestamp < b.timestamp;
						});
						if(assignments.length === 0){
							assembledFile = data.replace("<div id='appendhere'>", "<div class='first-time'><h2>Welcome to JustOpine!</h2> <br> <h3>You have no active assignments.</h3><br><p>If this is your first time here, click on <em><strong>Class Lists</strong></em> to add your first class.<br><br>After that, you are free to set your class their first assignment.  Click on <em><strong>Set Assignment</strong></em> to do that.</p></div>");
						} else {
							for (var key in assignments) {
								var textExtract = assignments[key].text.split(/\s+/).slice(0,50).join(" ");

								assembledData += "<a href='/gi/" + assignments[key].class + "/" + assignments[key].assignmentID + "'><div class='dashboard-assignment'><div class='dashboard-image'><img src='" + assignments[key].image + "'></div><h2><img class='assignment-icon' src='/static/public/images/assignment.png'>" + assignments[key].title + "</h2><p>" + textExtract + "...</p><div class='tag'>" + assignments[key].class + "</div><div class='tag'>" + assignments[key].category + "</div></div></a>";
							}
							assembledFile = data.replace("<div id='appendhere'>", assembledData);
						}
						reply(assembledFile);
					}
				});
			}
		});
	},

	"classes": function (request, reply){
		var teacherID = request.auth.credentials.userID;
		var assembledFile;
		var assembledData = "";
		fs.readFile("./public/views/classes.html", "utf8", function (err, data) {
			if (err) {
				reply.redirect("/error");
			} else {
				api.getClasses(teacherID, function(err, classes){
					if (err){
						reply.redirect("/error");
					} else {
						if (classes.length === 0){
							assembledFile = data.replace("<div id='appendhere'>", "<div class='first-time'><h3>You have no classes registered.</h3><br>  Click <em><strong>Add Class</strong></em> to register your first class.<br>Once you've done that, click on the class to add your pupils.</p></div>");
						} else {
							for (var i=0; i<classes.length; i++) {
						        var className = classes[i];
						        assembledData += "<a href='/pupils?" + className + "'><div class='class-div' id='" + className + "'>" + "<img class='class-icon' src='../static/public/images/assignment.png'>" + "<h4>" + classes[i] + "</h4></div></a>";
					    	}
							assembledFile = data.replace("<div id='appendhere'>", assembledData);
						}
					}
					reply(assembledFile);
				});
			}
		});
	},

	"pupils": function (request, reply){
		var assembledFile;
		fs.readFile("./public/views/pupils.html", "utf8", function (err,data) {
			if (err) {
				reply.redirect("/error");
			} else {
				className = url.parse(request.url).search.replace("?","");
				var userID = request.auth.credentials.userID;

				api.getPupils(userID, className, function(err, pupils) {
					var pupilList = "";
					for (var i = 0; i < pupils.length; i++){
						pupilList += "<td><img class='student-icon' src='../static/public/images/face.png'></td>" + "<td>" + pupils[i].surname + "</td><td>" + pupils[i].firstname + "</td><td>" + pupils[i].level + "</td></tr>";
					}
					assembledFile = data.replace("<div id='appendhere'></div>", pupilList);
					reply(assembledFile);
				});
			}
		});
	},
	"assignmentPupil": function (request, reply){
		reply.file("./public/views/assignment-pupil.html");
	},
	"assignmentTeacher": function (request, reply){
		reply.file("./public/views/assignment-teacher.html");
	},
	"setAssignment": function (request, reply){
		var assembledFile;
		fs.readFile("./public/views/new-assignment.html", "utf8", function (err, data) {
			if (err) {
				reply.redirect("/error");
			} else {
				var userID = request.auth.credentials.userID;
				api.getClasses(userID, function(err, classNames){
					if (classNames.length === 0) {
						reply.file("./public/views/no-class-no-assignment.html");
					} else {
						var assembledData = "";
						for (var i = 0; i < classNames.length; i++) {
					        assembledData += "<option value='" + classNames[i] + "'>" + classNames[i] + "</option>";
					    }
						assembledFile = data.replace("<option id='appendhere'></option>", assembledData);
						reply(assembledFile);
					}
				});
			}
		});
	},
	"displayError": function(request, reply) {
		reply.file("./public/views/error.html");
	},
	"registrationTeacher": function (request, reply){
		var assembledFile;
		if(!request.auth.credentials.isTeacher){
			reply.file("./public/views/no-auth.html");
		} else {
			fs.readFile("./public/views/reg-teacher.html", "utf8", function(err, data){
				if(err){
					reply.redirect("/error");
				} else {
					var teacherList = "";
					api.getTeachers(function(error, teachers){
						if(error){
							reply.redirect("/error");
						} else {
							for (var i = 0; i < teachers.length; i++){
								teacherList += "<td><img class='student-icon' src='../static/public/images/face.png'></td>" + "<td>" + teachers[i].surname + "</td><td>" + teachers[i].firstname + "</td><td>" + teachers[i].username + "</td></tr>";
							}
							assembledFile = data.replace("<div id='appendhere'></div>", teacherList);
							reply(assembledFile);
						}
					});
				}
			});
		}
	},
};

module.exports = handlers;

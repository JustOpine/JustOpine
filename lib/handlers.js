var base = require('./db.js');
var url = require('url');
var meta = require('./meta.js');
var auth = require('./auth.js');


/* istanbul ignore next */

function handlers(config) {
	var client = base(config); // {realredis} or {fakeredis}

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
		'logout' : function(request, reply) {
			console.log("ahoy!!");
			request.auth.session.clear();
			console.log(request.auth);
			reply.redirect('/');
			// reply.file('./public/views/landing.html');
		},
		'meta' : function(request, reply){  // FIX HACKYNESS
			if (request.payload){ // post req
				var deets = request.payload;
				deets.isTeacher = 1;
				deets.isAdmin = 0;
				meta.toDB(deets, client, function (err, data) {
					console.log(err, data);
					console.log(data);
					reply(data);
					client.quit();
				});
			} else {
				reply.file('./public/views/reg-teacher.html');
			}
		},
		'studentdash' : function (request, reply){
			reply.file('./public/views/studentdashboard.html');
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
		'doesKeyExistInDb' : function (request, reply){
			var key = juergen;
			client.doesKeyExistInDb(key, function(err, data) {
				if(err){
					console.log(err);
				} else if (data === 0) {
					console.log(key + " doesn't exist");
					reply(key + " doesn't exist");
				} else { // data === 1
					console.log(key + " exists");
					reply(key + " exists");
				}
			});
		},
		'addToSet' : function(request, reply) {
			var setKey = 'teacher',
				setMember = 'victoria';
			client.sadd(setKey, setMember, function(err, data) {
				console.log(err, data); //result from redis
				if(err){
					console.log('error: ' + err);
					reply('error: ' + err);
				} else if (data === 0){
					console.log(setMember + ' already exists in ' + setKey);
					reply(setMember + ' already exists in ' + 'teacher');
				} else { // data === 1
					console.log(setMember + ' was added to ' + setKey);
					reply(setMember + ' was added to ' + setKey);
				}
				client.quit();
			});
		},
		'removeFromSet' : function(request, reply) {
			var setKey = 'teacher',
				setMember = 'victoria';
			client.srem(setKey, setMember, function(err, data) {
				console.log(err, data); //result from redis
				if(err){
					reply('error: ' + err);
				} else if (data === 0){
					console.log('couldn\'t find ' + person + ' in ' + 'teacher');
					reply('couldn\'t find ' + person + ' in ' + 'teacher');
				} else { // data === 1
					console.log(person + ' was successfully removed from ' + 'teacher');
					reply(person + ' was successfully removed from ' + 'teacher');
				}
				client.quit();
			});
		},
		'addHash' : function (request, reply){
			var hashname = 'hash1';
			var key = 'key1';
			var value = 'value1';
			client.hset(hashname, key, value, function(err, data){
				console.log(err, data);
				if (err) {
					reply("Error: " + err);
				} else if(data === 0) {
					console.log(hashname + " already exists");
					reply(hashname + " already exists");
				} else {
					console.log(hashname + " : " + key + " value " + value + " added");
					reply(hashname + " : " + key + " value " + value + " added");
				}
				client.quit();
			});
		},
		'getAllKeysFromHash' : function (request, reply){
			var hashname = 'hash1';
			client.hgetall(hashname, function(err, data){
				console.log(err, data);
				if (err) {
					console.log(err);
					reply("Error: " + err);
				} else {
					console.log("keys from hash: ", data);
					reply("keys from hash: " + data);
				}
				client.quit();
			});
		},
		'logMessage' : function(request, reply) {

		}
	};
}
module.exports = handlers; // exported to routes

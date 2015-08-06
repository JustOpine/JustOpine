/* istanbul ignore next */

function handlers(config) {

var apiMethods = require('./api_methods.js')(config);

	return {
		'home' : function (request, reply){
			reply.file('./public/views/reg-teacher.html');
		},
		'login': function(request, reply){

			console.log(request.auth);
			reply('you have logged in!');
		},
		'api' : function (request, reply){
			var obj = JSON.parse(request.payload);
			apiMethods[obj.dbmethod](obj,function(arg){
				reply(arg);

			});
		},
		'studentdash' : function (request, reply){
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

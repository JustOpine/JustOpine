var redis = require('./redis');

module.exports = {
	'home' : function (request, reply){
		reply.file('./public/views/landing.html');
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
	'redis' : function (request, reply){
		redis().addUserToDB('stuff',function(arg){
			reply(arg);
		});
		//console.log("We expect a result here: ",resulty);
	}
};

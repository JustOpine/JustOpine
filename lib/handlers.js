var redis = require('./redis');

module.exports = {
	'home' : function (request, reply){
		reply.file('./public/index.html');
	},
	'redis' : function (request, reply){
		redis().addUserToDB('stuff',function(arg){		
			reply(arg);
		});
		//console.log("We expect a result here: ",resulty);
	}
};
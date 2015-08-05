function apiMethods (config) {

var redisMethods = require('./redis_methods.js')(config);

        //console.log(argument);
    return{
       addTeacher: function(data, callback){
            //console.log(redisMethods);
            redisMethods.addToSet(data.role, data.firstname, callback);
        },
        'registerClass': function(data, callback){
            redisMethods.removeFromSet(data.role, data.firstname, callback);    
        },
        'registerStudent': function(){

        },
        'registerDiscussion': function(){

        }
    };
}
module.exports = apiMethods; // exported to handlers
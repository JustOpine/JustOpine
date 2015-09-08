var bcrypt = require('bcrypt');
var client = require('./db.js');

module.exports = function(request, username, password, callback){
    if(!username || !password) {
        callback(null, false, null);
    }
    var credentials = {};
    client.hget('login', username, function(err, data) {
        if (!data){
            console.log("!!!");
            callback(null, false, null);
        } else {
            var loginDetails = JSON.parse(data);
            bcrypt.compare(password, loginDetails.password, function(err, passMatch) {
                if(!passMatch){
                    console.log("!");
                    callback(null, false, null);
                } else {
                    var teacherOrPupil = loginDetails.userID.toString().length == 6 ? 'teacher' : loginDetails.userID.split(':').slice(0, 2).join(':') + ':pupil';
                    client.hget(teacherOrPupil, loginDetails.userID, function(err, userInfo) {

                        if (!userInfo){
                            console.log("!!");
                            callback(null, false, null);
                        } else {
                            callback(null, true, JSON.parse(userInfo));
                        }
                    });
                }
            });
        }
    });
};

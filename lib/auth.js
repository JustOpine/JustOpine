var bcrypt = require('bcrypt');
var client = require('./db.js');

module.exports = function(request, username, password, callback){
    if(!username || !password) {
        callback(null, false, null);
    }
    var credentials = {};
    client.hget('login', username, function(err, data) {
        if (!data){
            callback(null, false, null);
        } else {
            var loginDetails = JSON.parse(data);
            bcrypt.compare(password, loginDetails.password, function(err, passMatch) {
                if(!passMatch){
                    callback(null, false, null);
                } else {
                    var location = loginDetails.userID.toString().length == 6 ? 'teachers' : loginDetails.userID.split(':').slice(0, 2).join(':') + ':pupil';
                    client.hget(location, loginDetails.userID, function(err, userInfo) {
                        if (!userInfo){
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

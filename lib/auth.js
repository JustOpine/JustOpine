var bcrypt = require('bcrypt');
var client = require('./db.js');

module.exports = function(request, username, password, callback){
    // check password
    // check username against key in teacher:login
    if(!username || !password) {
        callback(null, false, null);
    }
    var credentials = {};
    client.hget('login', username, function(err, data) {
        console.log('from hget: ');
        console.log(err, data);
        if (!data){
            console.log('!data');
            callback(null, false, null);
        } else {
            var loginDetails = JSON.parse(data);
            console.log('looked in login and found ', loginDetails);
            console.log('password is: ', loginDetails.password);
            bcrypt.compare(password, loginDetails.password, function(err, passMatch) {
                console.log("passMatch is ", passMatch);
                //client.quit();
                if(!passMatch){
                    callback(null, false, null);
                } else {
                    // find rest of user info
                    console.log(loginDetails.userID.toString().length);
                    var location = loginDetails.userID.toString().length == 6 ? 'teachers' : loginDetails.userID.split(':').slice(0, 2).join(':') + ':pupil';
                    console.log(location);
                    client.hget(location, loginDetails.userID, function(err, userInfo) {
                        console.log("userInfo: ", userInfo)
                        if (!userInfo){
                            console.log('!userInfo');
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

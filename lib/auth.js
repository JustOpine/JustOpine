var bcrypt = require('bcrypt');
var client = require('./db.js');

module.exports = function(request, username, password, callback){
    // check password
    // check username against key in teacher:login
    if(!username || !password) {
        callback(null, false, null);
    }
    var credentials = {};
    client.hget('login', username, function(err, id) {
        console.log('from hget: ');
        console.log(err, id);
        if (!id){
            console.log('!id');
            callback(null, false, null);
        } else {
            // var loginDetails = JSON.parse(data);
            // console.log('looked in login and found ', loginDetails);
            // // look for teacher || pupil
            // // login
            // // should:
            // // look in login hash
            // // key: username, value: hash of userinfo (incl passhash and id)
            // console.log("All the data: ", loginDetails);
            // console.log('password is: ', loginDetails.password);
            // bcrypt.compare(password, loginDetails.password, function(err, passMatch) {
            //     console.log("passMatch is ", passMatch);
            //     //client.quit();
            //     if(!passMatch){
            //         callback(null, false, null);
            //     } else {
            //        // find rest of user info
            //         if(loginDetails.userID.length > 6){
            //             console.log(loginDetails.userID.length);
            //         }
            //         // credentials.ID = id;
            //         // credentials.firstname = data.firstname;
            //         // credentials.surname = data.surname;
            //         // credentials.isTeacher = (data.isTeacher === 'true');
            //         // credentials.isAdmin = (data.isAdmin === 'true');
            //         // callback(err, passMatch, credentials);
            //     }
            // });
            // console.log('length: ', id.length);
            // var key = id.toString().length >= 6 ? 'teacher' : id.split(':').slice(0, 2).join(':') + ':class';
            // console.log(key);

            client.hgetall('teacher:' + id, function(err, data) {
                console.log("All the data: ", data);
                console.log('password is: ', data.password);
                bcrypt.compare(password, data.password, function(err, passMatch) {
                    console.log("passMatch is ", passMatch);
                    //client.quit();
                    if(!passMatch){
                        callback(null, false, null);
                    } else {
                        credentials.ID = id;
                        credentials.firstname = data.firstname;
                        credentials.surname = data.surname;
                        credentials.isTeacher = (data.isTeacher === 'true');
                        credentials.isAdmin = (data.isAdmin === 'true');
                        callback(err, passMatch, credentials);
                    }
                });
            });
        }
    });
};

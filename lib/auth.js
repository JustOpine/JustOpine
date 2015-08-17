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
                  //  console.log(loginDetails.userID.toString().length);
                    var location = loginDetails.userID.toString().length >= 6 ? 'teachers' : loginDetails.userID.split(':').slice(0, 2).join(':') + ':class';
                    // console.log(location);
                    client.hget(location, loginDetails.userID, function(err, userInfo) {
                        if (!userInfo){
                            console.log('!userInfo');
                            callback(null, false, null);
                        } else {
                          // console.log(userInfo);
                            callback(null, true, JSON.parse(userInfo));
                        }
                    });
                }
            });
        }
    });
};
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
        // client.hget('login', username, function(err, id) {
        //     console.log('from hget: ');
        //     console.log(err, id);
        //     if (!id){
        //         console.log('!id');
        //         callback(null, false, null);
        //     } else {

            // client.hgetall('teacher:' + id, function(err, data) {
            //     console.log("All the data: ", data);
            //     console.log('password is: ', data.password);
            //     bcrypt.compare(password, data.password, function(err, passMatch) {
            //         console.log("passMatch is ", passMatch);
            //         //client.quit();
            //         if(!passMatch){
            //             callback(null, false, null);
            //         } else {
            //             credentials.ID = id;
            //             credentials.firstname = data.firstname;
            //             credentials.surname = data.surname;
            //             credentials.isTeacher = (data.isTeacher === 'true');
            //             credentials.isAdmin = (data.isAdmin === 'true');
            //             callback(err, passMatch, credentials);
//             //         }
//             //     });
//             });
//         // }
//     // });
// };

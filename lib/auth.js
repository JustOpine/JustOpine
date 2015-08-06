var bcrypt = require('bcrypt');
var Basic = require('hapi-auth-basic');
var Cookie = require('hapi-auth-cookie');


module.exports = function(request, username, password, client, callback){
    // check password
    // check username against key in teacher:login
    if(!username || !password) {
        callback(null, false, null);
    }
    var credentials = {};
    client.hget('teacher:login', username, function(err, id) {
        console.log('from hget: ');
        console.log(err, id);
        if (!id){
            console.log('!id');
            callback(null, false, null);
        } else {
            console.log('looked in teacher:login and found ', id);
            var key = 'teacher:' + id;
            client.hgetall(key, function(err, data) {
                console.log("All the data: ", data);
                console.log('password is: ', data.password);
                bcrypt.compare(password, data.password, function(err, passMatch) {
                    console.log("passMatch is ", passMatch);
                    client.quit();
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

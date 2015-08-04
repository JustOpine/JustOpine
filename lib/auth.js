var bcrypt = require('bcrypt');
var Basic = require('hapi-auth-basic');
var Cookie = require('hapi-auth-cookie');

module.exports = function(deets, client, callback){
    // check password
    // check username against key in teacher:login
    client.hget('teacher:login', deets.username, function(err, id) {
        console.log('looked in teacher:login and found ', id);
        //client.quit();

        var key = 'teacher:' + id;
        client.hget(key, 'password', function(err, passHash) {
            console.log('password is: ', passHash);
            //  callback(pass);
            bcrypt.compare(deets.password, passHash, function(err, res) {
                // if ok, authenticate
                console.log(res);
                callback(res);
                // else tell to get lost
            });
        });

    });
};

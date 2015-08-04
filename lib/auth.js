var bcrypt = require('bcrypt');
var Basic = require('hapi-auth-basic');
var Cookie = require('hapi-auth-cookie');

module.exports = function(sth, client){
    // check password


    bcrypt.compareSync(pass, dbHash, function(err, res) {
        // if ok, authenticate

        // else tell to get lost
    });


};

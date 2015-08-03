var bcrypt = require('bcrypt');
var Basic = require('hapi-auth-basic');

bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash('B4c0/\/', salt, function(err, hash) {
        // Store hash in your password DB.
    });
});

var test = require("tape");
var url = require('url');
var client = require('../lib/db.js');
var api = require('../lib/api.js');


test("database is running", function (t) {
    client.set('TEST', 'REMOTE');
    client.get('TEST', function (err, reply) {
        t.equal(reply, 'REMOTE', 'Database is running');
        client.del('TEST');
        client.end();
        t.end();
    });
});

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

// test("generateID generates a six digit number", function (t) {
//     var id = api.generateID;
//     console.log(id);
//     // client.get('TEST', function (err, reply) {
//     //     t.equal(reply, 'REMOTE', 'Database sets and gets correctly');
//     //     client.del('TEST');
//     //     client.end();
//     //     t.end();
//     // });
// });

// test("addPerson can add a person to Redis", function (t) {
//     var userInfo = {
//
//     }
//     client.apiset('TEST', 'REMOTE');
//     client.get('TEST', function (err, reply) {
//         t.equal(reply, 'REMOTE', 'Database sets and gets correctly');
//         client.del('TEST');
//         client.end();
//         t.end();
//     });
// });

// test("addToSet works", function (t) {
//     handlers.addToSet('person', 'michelle');
//     client.sismember('person', 'michelle', function (err, reply) {
//         t.equal(reply, '1', 'addToSet works properly');
//         handlers.client.srem('person', 'michelle');
//         handlers.client.end();
//         t.end();
//     });
// });

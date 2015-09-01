var test = require("tape");
var url = require('url');
var client = require('../lib/db.js');
var api = require('../lib/api.js');

test("database is running", function (t) {
    client.set('test', 'testData');
    client.get('test', function (err, reply) {
        t.equal(reply, 'testData', 'Database is running');
        client.del('test');
        t.end();
    });
});
//
// test("getPupils returns an array of correct data and length", function (t) {
//     client.hmset("123456:testClass:pupil", "testPupil1", {"surname":"Izaak","firstname":"Sofer","level":"genius"}, "testPupil2", {"surname":"Izaak","firstname":"Sofer","level":"genius"}, function(err, data1) {
//         api.getPupils("123456", "test", function(err, data) {
//             t.equal(data, [{"surname":"Izaak","firstname":"Sofer","level":"genius"}, {"surname":"Izaak","firstname":"Sofer","level":"genius"}]);
//             t.equal(data.length, 2);
//             client.del("123456:testClass:pupil");
//             t.end();
//         });
//     });
// });

test("addClass adds to a list", function (t) {
    api.addClass("123456", "testClass", function(err, data) {
        client.smembers("123456:class", function(err, classData) {
            t.equal(classData, ["testClass"], 'addClass is working');
            client.del("123456:class");
            t.end();
        });
    });
});

test("getClasses returns an array of the correct data and length", function(t) {
    client.sadd("123456:class", "testClass", function(err, data) {
        api.getClasses("123456", function(err, classData) {
            t.equal(classData, ["testClass"], 'correct data comes out');
            t.equal(classData.length, 1, 'array is correct length');
            client.del("12345:class");
            t.end();
        });
    });
});

test("addAssignment adds an assignment to a hash", function(t) {
    var assignmentObject = {
        class: "testClass"
    };
    api.addAssignment("123456", assignmentObject, function(err, data) {
        client.hgetall("123456:testClass:assignment", function(err, assignmentData) {
            t.equal(assignmentData.length, 1);
            client.del("123456:testClass:assignment");
            t.end();
        });
    });
});

test("getAssignment returns a stringified object with assignment info", function(t) {
    var testAssignment = {
        class: "testClass"
    };
    client.hmset("123456:testClass:assignment", assignmentObject, function(err,data) {
        api.getAssignment("123456", "testClass", "testAssignment", function(err, assignmentData) {
            t.equal(assignmentData, testAssignment);
            client.del("123456:testClass:assignment");
            t.end();
        });
    });
});

test("getAssignmentsForOneClass returns an array of objects of correct length", function(t) {
    var testAssignment = {
        class: "testClass"
    };
    client.hmset("123456:testClass:assignment", testAssignment, function(err,data) {
        api.getAssignmentsForOneClass("123456", "testClass", function(err, assignmentData) {
            t.equal(assignmentData, testAssignment, "correct data");
            t.equal(assignmentData.length, 1, "correct length");
            client.del("123456:testClass:assignment");
            t.end();
        });
    });
});

test("getAssignmentsForAllClasses returns an array of objects of correct length", function(t) {
    var testAssignment = {
        title: "this is a test assignment"
    };
    var expectedData = [{ }, { }];
    client.sadd("123456:class", "testClass", function(err, data) {
        client.sadd("123456:class", "testClass2", function(err, data2) {
            client.hmset("123456:testClass:assignment", assignmentObject, function(err, assignmentData) {
                client.hmset("123456:testClass2:assignment", assignmentObject, function(err, assignmentData2) {
                    api.getAssignmentsForAllClasses("123456", function(err, assignmentData) {
                        t.equal(assignmentData, expectedData, "correct data");
                        t.equal(assignmentData.length, 2, "correct length");
                        client.del("123456:testClass:assignment");
                        client.del("123456:testClass2:assignment");
                        t.end();
                    });
                });
            });
        });
    });
});

test("addResponse saves response key to a set of discussions", function(t) {
    var timestamp = new Date();
    var testReponse = {};
    api.addResponse(timestamp, "testClass", "testAssignment", testReponse, "123456", "Test Name", function(err, data) {

    });
});






var end;

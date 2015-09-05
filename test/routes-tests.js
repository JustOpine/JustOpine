var assert = require('assert');
var server = require('../server.js');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var Code = require('code');
var client = require('../lib/db.js');
var api = require('../lib/api.js');

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

lab.test('returns true when 1 + 1 equals 2', function (done) {
    Code.expect(1+1).to.equal(2);
    done();
    console.log("#lab works");
});

it("Testing the landing.html is sent when requested and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/'}, function (res) {
        assert.equal(res.statusCode, 200 );
        done();
        console.log("#landing page loads correctly");
    });
});

it("Testing the new assignment page is sent when requested by authenticated user and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/new', credentials: {isTeacher : true}}, function (res) {
        assert.equal(res.statusCode, 200 );
        done();
        console.log("#set new assignment page loads correctly");
    });
});

it("Testing the pupil dashboard is sent when requested by authenticated user and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/dash2', credentials: {isTeacher : false}}, function (res) {
        assert.equal(res.statusCode, 200 );
        done();
        console.log("#pupil dashboard page loads correctly");
    });
});

it("Testing the teacher dashboard is sent when requested by authenticated user and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/dash1', credentials: {isTeacher : true}}, function (res) {
        assert.equal(res.statusCode, 200 );
        done();
        console.log("#teacher dashboard page loads correctly");
    });
});

it("Testing the pupil assignment page is sent when requested by authenticated user and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/assignment2', credentials: {isTeacher : true}}, function (res) {
        assert.equal(res.statusCode, 200 );
        done();
        console.log("#student assignment page loads correctly");
    });
});

it("Testing the teacher assignment page is sent when requested by authenticated user and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/assignment1', credentials: {isTeacher : true}}, function (res) {
        assert.equal(res.statusCode, 200 );
        done();
        console.log("#teacher assignment page loads correctly");
    });
});

it("Testing the classes is sent when requested by authenticated user and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/classes', credentials: {isTeacher : true}}, function (res) {
        assert.equal(res.statusCode, 200 );
        done();
        console.log("#classes page loads correctly");
    });
});

// TODO: make this test pass, there seems to be an issue even though res.StatusCode === 200

// it("Testing the pupils list page is sent when requested by authenticated user and statusCode is 200", function(done){
//     api.addClass("testTeacher", "testClass", function(err, data) {
//         server.inject({method: 'GET', url: '/pupils?testClass', credentials: {isTeacher : true}}, function (res) {
//             assert.equal(res.statusCode === 200, true);
//             done();
//             client.del("testTeacher:class");
//             console.log("#pupils page loads correctly");
//         });
//     })
// });

it("Testing the teacher registration page is sent when requested by authenticated user and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/registration', credentials: {isTeacher : true}}, function (res) {
        assert.equal(res.statusCode, 200 );
        done();
        console.log("#pupils page loads correctly");
    });
});

it("Testing generic GET request to /static/{path*} works", function(done){
    var options = {
        method: "GET",
        url: "/static/public/images/marbles.jpg"
    };
    server.inject(options, function (res) {
        assert.equal(res.statusCode, 200 );
        done();
        console.log("#generic GET request to /static/{path*} works");
    });
});

var assert = require('assert');
var server = require('../server.js');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var Code = require('code');

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

console.log("#lab works");
lab.test('returns true when 1 + 1 equals 2', function (done) {
    Code.expect(1+1).to.equal(2);
    done();
});

console.log("#landing page loads correctly");
it("Testing the landing.html is sent when requested and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/'}, function (res) {
        assert.equal(res.statusCode, '200' );
        done();
    });
});

console.log("#set new assignment page loads correctly");
it("Testing the landing.html is sent when requested and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/new'}, function (res) {
        assert.equal(res.statusCode, '200' );
        done();
    });
});

console.log("#student dashboard page loads correctly");
it("Testing the landing.html is sent when requested and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/studentdash'}, function (res) {
        assert.equal(res.statusCode, '200' );
        done();
    });
});

console.log("#teacher dashboard page loads correctly");
it("Testing the landing.html is sent when requested and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/teacherdash'}, function (res) {
        assert.equal(res.statusCode, '200' );
        done();
    });
});

console.log("#student discussion page loads correctly");
it("Testing the landing.html is sent when requested and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/studentdiscussion'}, function (res) {
        assert.equal(res.statusCode, '200' );
        done();
    });
});

console.log("#teacher discussion page loads correctly");
it("Testing the landing.html is sent when requested and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/teacherdiscussion'}, function (res) {
        assert.equal(res.statusCode, '200' );
        done();
    });
});

console.log("#classes page loads correctly");
it("Testing the landing.html is sent when requested and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/classes'}, function (res) {
        assert.equal(res.statusCode, '200' );
        done();
    });
});

console.log("#students page loads correctly");
it("Testing the landing.html is sent when requested and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/students'}, function (res) {
        assert.equal(res.statusCode, '200' );
        done();
    });
});

console.log("#students page loads correctly");
it("Testing the landing.html is sent when requested and statusCode is 200", function(done){
    server.inject({method: 'GET', url: '/students'}, function (res) {
        assert.equal(res.statusCode, '200' );
        done();
    });
});

console.log("#generic GET request to /static/{path*} works");
it("Testing generic GET request to /static/{path*} works",
function(done){
    var options = {
        method: "GET",
        url: "/static/public/images/marbles.jpg"
    };
    server.inject(options, function (res) {
        assert.equal(res.statusCode, '200' );
        done();
    });
});

// it("Test to check that user is sent to index.html with statusCode 200 when not authenticated", function(done){
//   server.inject({method: 'GET', url: '/dashboard'}, function (res) {
//     assert.equal(res.statusCode, '200' );
//     done();
//   });
// });
//
// it("Test to check that user is sent to dashboard.html with statusCode 200 when user is authenticated", function(done){
//   server.inject({method: 'GET', url: '/dashboard'}, function (res) {
//     assert.equal(res.statusCode, '200' );
//     done();
//   });
// });
//
// it("Test to check that user is sent to challenge.html with statusCode 200", function(done){
//   server.inject({method: 'GET', url: '/join-challenge'}, function(res){
//     assert.equal(res.statusCode, '200');
//     done();
//   });
// });
//
// it("Test to check that user is sent to dashboard.html with statusCode 200 when authenticated", function(done){
//   server.inject({method: 'GET', url: '/profile'}, function(res){
//     assert.equal(res.statusCode, '200');
//     done();
//   });
// });
//
// it("Test to check that user is redirected to landing page with statusCode 302", function(done){
//   server.inject({method: 'GET', url: '/logout'}, function (res) {
//     assert.equal(res.statusCode, '302' );
//     done();
//   });
// });

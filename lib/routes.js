var handlers = require('./handlers.js');
var meta = require('./meta.js');

var routes = function(config) {
    var handlers = require('./handlers.js')(config); // object containing methods.
    return [
        {
          method: 'GET', path: '/', handler: handlers.home
        },
        {
            method: 'GET', path: '/toDB', handler: meta.toDB
        },
        {
          method: 'POST', path: '/login', handler: handlers.login
        },
        {
            method: 'GET', path: '/studentdash', handler: handlers.studentdash
        },
        {
            method: 'GET', path: '/teacherdash', handler: handlers.teacherdash
        },
        {
            method: 'GET', path: '/classes', handler: handlers.classes
        },
        {
            method: 'GET', path: '/students', handler: handlers.students
        },
        {
            method: 'GET', path: '/studentdiscussion', handler: handlers.studentdiscussion
        },
        {
            method: 'GET', path: '/teacherdiscussion', handler: handlers.teacherdiscussion
        },
        {
            method: 'GET', path: '/new', handler: handlers.setassignment
        },
        {
          method: 'GET', path: '/addset', handler: handlers.addToSet
        },
        {
          method: 'GET', path: '/removeset', handler: handlers.removeFromSet
        },
        {
          method: 'GET', path: '/addhash', handler: handlers.addHash
        },
        {
          method: 'GET', path: '/gethashkeys', handler: handlers.getAllKeysFromHash
        },
        {
          method: 'GET', path: '/static/{path*}', handler: {directory: {path: './'} }
        }
    ];
};

module.exports = routes; // export to server_config

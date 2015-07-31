var handlers = require('./handlers.js');

var routes = function(config) {
    var handlers = require('./handlers.js')(config);
    return [
        {
          method: 'GET', path: '/', handler: handlers.home
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

module.exports = routes;

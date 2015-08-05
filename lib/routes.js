var handlers = require('./handlers.js');
var meta = require('./meta.js');

var routes = function(config) {
    var handlers = require('./handlers.js')(config); // object containing methods.
    return [
        {
            method: ['GET'], // get == go straight to login page, post == user trying to login
            path: '/',
            config: {
                handler: handlers.home,
                auth: {
                    mode: 'optional', //optional authentication
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {redirectTo: false}
                }
            }
        },
        {
            method: 'GET', path: '/meta', handler: handlers.meta
        },
        {
            method: 'POST', path: '/meta', handler: handlers.meta
        },
        {
            method: ['POST', 'GET'],
            path: '/login',
            config: {
                handler: handlers.login,
                auth: {
                  mode: 'optional',
                  strategy: 'session'
                },
                plugins: {
                  'hapi-auth-cookie': {redirectTo: false}
                }
            }
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

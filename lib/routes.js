var handlers = require('./handlers.js');
var meta = require('./meta.js');

var routes = function(config) {
    var handlers = require('./handlers.js')(config);
    return [
        {
            method: ['GET'],
            path: '/',
            config: {
                handler: handlers.home,
                auth: {
                    mode: 'try', //optional authentication
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {redirectTo: false}
                }
            }
        },
        {
            method: ['GET', 'POST'],
            path: '/meta',
            config: {
                handler: handlers.meta,
                auth: {
                    mode: 'optional'
                }
            }

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
            method: ['POST', 'GET'], path: '/api/{path*}', handler: handlers.api
        },
        {
            method: 'GET', path: '/logout', handler: handlers.logout
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
            method: 'GET', path: '/removeset', handler: handlers.removeFromSet
        },
        {
            method: 'GET', path: '/addhash', handler: handlers.addHash
        },
        {
            method: 'GET', path: '/gethashkeys', handler: handlers.getAllKeysFromHash
        },
        {
            method: 'GET', path: '/static/{path*}', config: {
                handler: {directory: {path: './'} },
                auth: {
                    mode: 'optional'
                }
            }
        }
    ];
};

module.exports = routes; // export to server_config

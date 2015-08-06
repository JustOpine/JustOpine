var handlers = require('./handlers.js');

var routes = [
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
            method: 'POST', path: '/justopineapi', handler: handlers.justopineapi
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
            method: 'GET',
            path: '/exampleapi',
            config:{
                handler: handlers.exampleApi,
                auth: {
                    mode: 'optional',
                    strategy: 'session'
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
            method: 'GET', path: '/static/{path*}', config: {
                handler: {directory: {path: './'} },
                auth: {
                    mode: 'optional',
                    strategy: 'session'
                }
            }
        }
    ];


module.exports = routes; // export to server_config

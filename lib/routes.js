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
            method: ['POST'],
            path: '/logout',
            config: {
                handler: handlers.logout,
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
            method: 'GET',
            path: '/registration',
            config:{
                handler: handlers.registrationTeacher,
                auth: {
                    mode: 'optional',
                    strategy: 'session'
                }
            }
        },
        {
            method: 'GET', path: '/dash2', handler: handlers.dashboardPupil
        },
        {
            method: 'GET', path: '/dash1',
            config: {
              handler: handlers.dashboardTeacher,

            }
        },
        {
            method: 'GET', path: '/classes', handler: handlers.classes
        },
        {
            method: 'GET', path: '/pupils/{path*}', handler: handlers.pupils
        },
        {
            method: 'GET', path: '/assignment2/{path*}', handler: handlers.assignmentPupil
        },
        {
            method: 'GET', path: '/assignment1/{path*}', handler: handlers.assignmentTeacher
        },
        {
            method: 'GET', path: '/new', handler: handlers.setAssignment
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

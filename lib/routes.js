var handlers = require('./handlers.js');

var routes = [
    {
        method: ['GET'],
        path: '/',
        config: {
            handler: handlers.home,
            auth: {
                mode: 'try',
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
            auth: false,
        }
    },
    {
        method: ['POST', 'GET'],
        path: '/logout',
        handler: handlers.logout,
    },
    {
        method: 'GET',
        path: '/error',
        config: {
            handler: handlers.displayError,
            auth: false
        }
    },
    {
        method: ['POST', 'GET'], path: '/api/{path*}',
        config: {
            handler: handlers.api,
            auth: false
        }

    },
    {
        method: 'GET',
        path: '/registration',
        config:{
            handler: handlers.registrationTeacher,
            auth: false
        }
    },
    {
        method: 'GET', path: '/dash2', handler: handlers.dashboardPupil
    },
    {
        method: 'GET', path: '/dash1', handler: handlers.dashboardTeacher
    },
    {
        method: 'GET', path: '/classes', handler: handlers.classes
    },
    {
        method: 'GET', path: '/pupils/{path*}', handler: handlers.pupils
    },
    {
        method: 'POST', path: '/pupils', handler: handlers.pupils
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
        method: 'GET', path: '/static/{path*}',
        config: {
            handler: {directory: {path: './'} },
            auth: false
        }
    }
];


module.exports = routes; // export to server_config

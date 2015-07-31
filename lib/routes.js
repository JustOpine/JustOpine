var routes = function(config) {
    var handlers = require('./handlers.js')(config); //{connection: realredis} or {connection: fakeredis}
    return [
        {
          method: 'GET', path: '/', handler: handlers.home
        },
        {
          method: 'GET', path: '/set', handler: handlers.set
        },
        {
          method: 'GET', path: '/remove', handler: handlers.remove
        },
        {
      	  method: 'GET', path: '/static/{path*}', handler: {directory: {path: './'} }
        }
    ];
};
module.exports = routes; // exported to server_config

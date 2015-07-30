var handlers = require('./handlers.js');

module.exports = [
  { 
  	method: 'GET', path: '/', handler: handlers.home
  },
  {
  	method: 'GET', path: '/redis', handler: handlers.redis
  },
  {
  	method: 'GET', path: '/static/{path*}', handler: {directory: {path: './'} }
  }
];
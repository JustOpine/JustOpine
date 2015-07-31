var redis = require('redis');
var url = require('url');
// var redisURL = (process.env.REDISURL);
var handlers = require('./handlers.js')({connection: redis});

module.exports = [
  {
  	method: 'GET', path: '/', handler: handlers.home
  },
  {
  	method: 'GET', path: '/redis', handler: handlers.redis
  },
  {
  	method: 'GET', path: '/redis1', handler: handlers.redis1
  },
  {
  	method: 'GET', path: '/redis2', handler: handlers.redis2
  },
  {
  	method: 'GET', path: '/static/{path*}', handler: {directory: {path: './'} }
  }
];

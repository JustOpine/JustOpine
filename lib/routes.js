var redis = require('redis');
var url = require('url');
// var redisURL = (process.env.REDISURL);
var handlers = require('./handlers.js')({connection: redis});

module.exports = [
    {
      method: 'GET', path: '/', handler: handlers.home
    },
    {
      method: 'GET', path: '/addset', handler: handlers.addToSet
    },
    {
      method: 'GET', path: '/removeset', handler: handlers.removeFromSet
    },
	  {
	  	method: 'GET', path: '/keyexist', handler: handlers.doesKeyExistInDb
	  },
	  {
	  	method: 'GET', path: '/addhash', handler: handlers.addHashToDb
	  },
	  {
	  	method: 'GET', path: '/gethashkeys', handler: handlers.getAllKeysFromHash
	  },
	  {
	  	method: 'GET', path: '/static/{path*}', handler: {directory: {path: './'} }
	  }
];

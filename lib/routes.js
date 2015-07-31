var handlers = require('./handlers.js');

module.exports = [
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
  	  method: 'GET', path: '/redis', handler: handlers.redis
  },
  {
  	  method: 'GET', path: '/static/{path*}', handler: {directory: {path: './'} }
  }
];

const proxy = require('http-proxy-middleware');
require('dotenv').config();

module.exports = function(app) {
  let backend = process.env['BACKEND_URL'];
  if (backend === undefined) {
    console.warn('There is not BACKEND_URL in environment variables.');
    backend = 'http://localhost:3000/';
  }
  app.use(
    proxy('/api', {
      target: backend,
    })
  );
};

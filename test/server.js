/*
 * Simple connect server for phantom.js
 * Adapted from Modernizr
 */

var connect = require('connect')
  , http    = require('http')
  , fs      = require('fs')
  , path    = require('path')
  , app     = connect();

app.use(connect.static(path.resolve(__dirname, '../')));

http.createServer(app).listen(8000);
console.log('listening on 8000');

fs.writeFileSync(__dirname + '/pid.txt', process.pid, 'utf-8');
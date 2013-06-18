/*
 * Simple connect server for phantom.js
 * Adapted from twitter bootstrap server.
 */

var connect = require('connect')
  , http    = require('http')
  , fs      = require('fs')
  , path    = require('path')
  , nopt    = require('nopt')
  , app     = connect();

var pidFile = path.resolve(__dirname, './pid.txt');

app.use(connect.static(path.resolve(__dirname, '../')));

http.createServer(app).listen(nopt({ port : Number }).port || 8000, function () {
  fs.writeFileSync(pidFile, process.pid, 'utf-8');
});


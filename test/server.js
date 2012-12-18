/*
 * Simple connect server for phantom.js
 * Adapted from twitter bootstrap server.
 */

var connect = require('connect')
  , http    = require('http')
  , fs      = require('fs')
  , path    = require('path')
  , app     = connect();

var pidFile = path.resolve(__dirname, './pid.txt');

app.use(connect.static(path.resolve(__dirname, '../')));

http.createServer(app).listen(8000, function () {
  fs.writeFileSync(pidFile, process.pid, 'utf-8');
});


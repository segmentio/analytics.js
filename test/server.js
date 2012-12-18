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

http.createServer(app).listen(8000);

app.use(connect.static(path.resolve(__dirname, '../')));

fs.writeFileSync(pidFile, process.pid, 'utf-8');
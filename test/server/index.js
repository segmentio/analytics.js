
var exec = require('child_process').exec;
var express = require('express');
var path = require('path');
var fs = require('fs');


/**
 * Port.
 */

var port = 4200;


/**
 * App.
 */

var app = express()
  .use(rebuild)
  .use(express.static(__dirname + '/../..'))
  .set('views', __dirname)
  .get('/coverage', function(_, res){
    res.sendfile(__dirname + '/coverage.html');
  })
  .get('*', function (req, res, next) {
    res.sendfile(__dirname + '/index.html');
  })
  .listen(port, function () {
    fs.writeFileSync(__dirname + '/pid.txt', process.pid, 'utf-8');
    console.log('Started testing server on port ' + port + '...');
  });

/**
 * Rebuild
 */

function rebuild(_, _, next){
  exec('make build', next);
}

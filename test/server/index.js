
var express = require('express')
  , fs = require('fs')
  , hbs = require('hbs')
  , path = require('path');


/**
 * App.
 */

var app = express()
  .use(express.static(__dirname + '/../..'))
  .set('views', __dirname)
  .engine('html', hbs.__express);


/**
 * Routes.
 */

app.get('/:type?', function (req, res, next) {
  var type = req.params.type || 'all';
  res.render('index.html', {
    integrations: type == 'integrations' || type == 'all',
    core: type == 'core' || type == 'all',
    all: type == 'all'
  });
});


/**
 * Start.
 */

var port = 4200;
var pid = path.resolve(__dirname, '.pid.txt');

app.listen(port, function () {
  fs.writeFileSync(pid, process.pid, 'utf-8');
  console.log('Started testing server on port ' + port + '...');
});
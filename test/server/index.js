
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
  var type = req.params.type || 'min';
  res.render('index.html', {
    providers: type == 'providers' || type == 'min',
    core: type == 'core' || type == 'min',
    min: type == 'min'
  });
});


/**
 * Start.
 */

var port = 4200;
var pid = path.resolve(__dirname, '.pid.txt');

app.listen(port, function () {
  fs.writeFileSync(pid, process.pid, 'utf-8');
  console.log('Listening on ' + port + '...');
});
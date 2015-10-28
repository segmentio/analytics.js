var Duo = require('duo');
var duo = new Duo(__dirname);

var src = 'var analytics = require(\'./lib\')\n';

var nosrc = 'console.log("hey");';

// duo.entry('lib/index.js')
duo.entry(src, 'js')
    .standalone('analytics')
    .write(function(err, res) {
        if (err) console.error(err);
    });

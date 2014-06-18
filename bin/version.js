
/**
 * Dependencies.
 */

var version = require('../component').version;
var join = require('path').join;
var bower = require('../bower');
var pkg = require('../package');
var fs = require('fs');

/**
 * Update.
 */

pkg.version = version;
bower.version = version;

/**
 * Path.
 */

var cwd = process.cwd();

/**
 * Write.
 */

fs.writeFileSync(join(cwd, 'package.json'), JSON.stringify(pkg, null, 2));
fs.writeFileSync(join(cwd, 'bower.json'), JSON.stringify(bower, null, 2));
fs.writeFileSync(join(cwd, 'lib', 'version.js'), '\nmodule.exports = \'' + version + '\';\n');

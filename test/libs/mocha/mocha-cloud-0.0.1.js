;(function(){
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(p, parent, orig){
  var path = require.resolve(p)
    , mod = require.modules[path];

  // lookup failed
  if (null == path) {
    orig = orig || p;
    parent = parent || 'root';
    throw new Error('failed to require "' + orig + '" from "' + parent + '"');
  }

  // perform real require()
  // by invoking the module's
  // registered function
  if (!mod.exports) {
    mod.exports = {};
    mod.client = mod.component = true;
    mod.call(this, mod, mod.exports, require.relative(path));
  }

  return mod.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path){
  var orig = path
    , reg = path + '.js'
    , regJSON = path + '.json'
    , index = path + '/index.js'
    , indexJSON = path + '/index.json';

  return require.modules[reg] && reg
    || require.modules[regJSON] && regJSON
    || require.modules[index] && index
    || require.modules[indexJSON] && indexJSON
    || require.modules[orig] && orig
    || require.aliases[index];
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `fn`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

require.register = function(path, fn){
  require.modules[path] = fn;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to){
  var fn = require.modules[from];
  if (!fn) throw new Error('failed to alias "' + from + '", it does not exist');
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj){
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function fn(path){
    var orig = path;
    path = fn.resolve(path);
    return require(path, parent, orig);
  }

  /**
   * Resolve relative to the parent.
   */

  fn.resolve = function(path){
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  fn.exists = function(path){
    return !! require.modules[fn.resolve(path)];
  };

  return fn;
};require.register("mocha-cloud/client.js", function(module, exports, require){

var Console = require('./console.js');

/**
 * Listen to `runner` events to populate a global
 * `.mochaResults` var which may be used by selenium
 * to report on results.
 *
 *    cloud(mocha.run());
 *
 * @param {Runner} runner
 * @api public
 */

module.exports = function(runner){
  var failed = [];
  window.console = new Console();

  runner.on('fail', function(test, err){
    failed.push({
      title: test.title,
      fullTitle: test.fullTitle(),
      error: {
        message: err.message,
        stack: err.stack
      }
    });
  });

  runner.on('end', function(){
    runner.stats.failed = failed;
    global.mochaResults = runner.stats;
  });
};
});
require.register("mocha-cloud/console.js", function(module, exports, require){
/**
 * Simple console to buffer headless log statements
 * and then add them to a buffer. Overrides console.log
 * and other log statements, then the buffer is read
 * by the mocha-cloud runner.
 */

// Keep a reference to our window.console.
var console = window.console;


var logger = function (level) {
  return function () {
    this.buffer.push({ level : level, args : arguments });

    if (console && console[level]) console[level].apply(console, arguments);
  };
};


var Console = module.exports = function Console () {
  this.buffer = [];
};


Console.prototype.log   = logger('log');
Console.prototype.warn  = logger('warn');
Console.prototype.info  = logger('info');
Console.prototype.error = logger('error');
Console.prototype.debug = logger('debug');


/**
 * Returns the buffer of logged messages
 *
 * [{
 *   level : 'log',
 *   args  : ['my', 'log', 'call']
 * }]
 *
 * @return {Array} buffer
 */
Console.prototype.read = function () {
  var buffer = this.buffer;
  this.buffer = [];

  return buffer;
};
});
require.alias("mocha-cloud/client.js", "mocha-cloud/index.js");
  if ("undefined" == typeof module) {
    window.cloud = require("mocha-cloud");
  } else {
    module.exports = require("mocha-cloud");
  }
})();
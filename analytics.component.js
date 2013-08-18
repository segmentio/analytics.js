
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
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

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
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
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
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

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("avetisk-defaults/index.js", Function("exports, require, module",
"'use strict';\n\
\n\
/**\n\
 * Merge default values.\n\
 *\n\
 * @param {Object} dest\n\
 * @param {Object} defaults\n\
 * @return {Object}\n\
 * @api public\n\
 */\n\
var defaults = function (dest, src, recursive) {\n\
  for (var prop in src) {\n\
    if (recursive && dest[prop] instanceof Object && src[prop] instanceof Object) {\n\
      dest[prop] = defaults(dest[prop], src[prop], true);\n\
    } else if (! (prop in dest)) {\n\
      dest[prop] = src[prop];\n\
    }\n\
  }\n\
\n\
  return dest;\n\
};\n\
\n\
/**\n\
 * Expose `defaults`.\n\
 */\n\
module.exports = defaults;\n\
//@ sourceURL=avetisk-defaults/index.js"
));
require.register("component-clone/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var type;\n\
\n\
try {\n\
  type = require('type');\n\
} catch(e){\n\
  type = require('type-component');\n\
}\n\
\n\
/**\n\
 * Module exports.\n\
 */\n\
\n\
module.exports = clone;\n\
\n\
/**\n\
 * Clones objects.\n\
 *\n\
 * @param {Mixed} any object\n\
 * @api public\n\
 */\n\
\n\
function clone(obj){\n\
  switch (type(obj)) {\n\
    case 'object':\n\
      var copy = {};\n\
      for (var key in obj) {\n\
        if (obj.hasOwnProperty(key)) {\n\
          copy[key] = clone(obj[key]);\n\
        }\n\
      }\n\
      return copy;\n\
\n\
    case 'array':\n\
      var copy = new Array(obj.length);\n\
      for (var i = 0, l = obj.length; i < l; i++) {\n\
        copy[i] = clone(obj[i]);\n\
      }\n\
      return copy;\n\
\n\
    case 'regexp':\n\
      // from millermedeiros/amd-utils - MIT\n\
      var flags = '';\n\
      flags += obj.multiline ? 'm' : '';\n\
      flags += obj.global ? 'g' : '';\n\
      flags += obj.ignoreCase ? 'i' : '';\n\
      return new RegExp(obj.source, flags);\n\
\n\
    case 'date':\n\
      return new Date(obj.getTime());\n\
\n\
    default: // string, number, boolean, …\n\
      return obj;\n\
  }\n\
}\n\
//@ sourceURL=component-clone/index.js"
));
require.register("component-cookie/index.js", Function("exports, require, module",
"/**\n\
 * Encode.\n\
 */\n\
\n\
var encode = encodeURIComponent;\n\
\n\
/**\n\
 * Decode.\n\
 */\n\
\n\
var decode = decodeURIComponent;\n\
\n\
/**\n\
 * Set or get cookie `name` with `value` and `options` object.\n\
 *\n\
 * @param {String} name\n\
 * @param {String} value\n\
 * @param {Object} options\n\
 * @return {Mixed}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(name, value, options){\n\
  switch (arguments.length) {\n\
    case 3:\n\
    case 2:\n\
      return set(name, value, options);\n\
    case 1:\n\
      return get(name);\n\
    default:\n\
      return all();\n\
  }\n\
};\n\
\n\
/**\n\
 * Set cookie `name` to `value`.\n\
 *\n\
 * @param {String} name\n\
 * @param {String} value\n\
 * @param {Object} options\n\
 * @api private\n\
 */\n\
\n\
function set(name, value, options) {\n\
  options = options || {};\n\
  var str = encode(name) + '=' + encode(value);\n\
\n\
  if (null == value) options.maxage = -1;\n\
\n\
  if (options.maxage) {\n\
    options.expires = new Date(+new Date + options.maxage);\n\
  }\n\
\n\
  if (options.path) str += '; path=' + options.path;\n\
  if (options.domain) str += '; domain=' + options.domain;\n\
  if (options.expires) str += '; expires=' + options.expires.toUTCString();\n\
  if (options.secure) str += '; secure';\n\
\n\
  document.cookie = str;\n\
}\n\
\n\
/**\n\
 * Return all cookies.\n\
 *\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function all() {\n\
  return parse(document.cookie);\n\
}\n\
\n\
/**\n\
 * Get cookie `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function get(name) {\n\
  return all()[name];\n\
}\n\
\n\
/**\n\
 * Parse cookie `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function parse(str) {\n\
  var obj = {};\n\
  var pairs = str.split(/ *; */);\n\
  var pair;\n\
  if ('' == pairs[0]) return obj;\n\
  for (var i = 0; i < pairs.length; ++i) {\n\
    pair = pairs[i].split('=');\n\
    obj[decode(pair[0])] = decode(pair[1]);\n\
  }\n\
  return obj;\n\
}\n\
//@ sourceURL=component-cookie/index.js"
));
require.register("component-to-function/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `toFunction()`.\n\
 */\n\
\n\
module.exports = toFunction;\n\
\n\
/**\n\
 * Convert `obj` to a `Function`.\n\
 *\n\
 * @param {Mixed} obj\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function toFunction(obj) {\n\
  switch ({}.toString.call(obj)) {\n\
    case '[object Object]':\n\
      return objectToFunction(obj);\n\
    case '[object Function]':\n\
      return obj;\n\
    case '[object String]':\n\
      return stringToFunction(obj);\n\
    case '[object RegExp]':\n\
      return regexpToFunction(obj);\n\
    default:\n\
      return defaultToFunction(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Default to strict equality.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function defaultToFunction(val) {\n\
  return function(obj){\n\
    return val === obj;\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert `re` to a function.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function regexpToFunction(re) {\n\
  return function(obj){\n\
    return re.test(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert property `str` to a function.\n\
 *\n\
 * @param {String} str\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function stringToFunction(str) {\n\
  // immediate such as \"> 20\"\n\
  if (/^ *\\W+/.test(str)) return new Function('_', 'return _ ' + str);\n\
\n\
  // properties such as \"name.first\" or \"age > 18\"\n\
  return new Function('_', 'return _.' + str);\n\
}\n\
\n\
/**\n\
 * Convert `object` to a function.\n\
 *\n\
 * @param {Object} object\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function objectToFunction(obj) {\n\
  var match = {}\n\
  for (var key in obj) {\n\
    match[key] = typeof obj[key] === 'string'\n\
      ? defaultToFunction(obj[key])\n\
      : toFunction(obj[key])\n\
  }\n\
  return function(val){\n\
    if (typeof val !== 'object') return false;\n\
    for (var key in match) {\n\
      if (!(key in val)) return false;\n\
      if (!match[key](val[key])) return false;\n\
    }\n\
    return true;\n\
  }\n\
}\n\
//@ sourceURL=component-to-function/index.js"
));
require.register("component-each/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var toFunction = require('to-function');\n\
var type;\n\
\n\
try {\n\
  type = require('type-component');\n\
} catch (e) {\n\
  type = require('type');\n\
}\n\
\n\
/**\n\
 * HOP reference.\n\
 */\n\
\n\
var has = Object.prototype.hasOwnProperty;\n\
\n\
/**\n\
 * Iterate the given `obj` and invoke `fn(val, i)`.\n\
 *\n\
 * @param {String|Array|Object} obj\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj, fn){\n\
  fn = toFunction(fn);\n\
  switch (type(obj)) {\n\
    case 'array':\n\
      return array(obj, fn);\n\
    case 'object':\n\
      if ('number' == typeof obj.length) return array(obj, fn);\n\
      return object(obj, fn);\n\
    case 'string':\n\
      return string(obj, fn);\n\
  }\n\
};\n\
\n\
/**\n\
 * Iterate string chars.\n\
 *\n\
 * @param {String} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function string(obj, fn) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn(obj.charAt(i), i);\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate object keys.\n\
 *\n\
 * @param {Object} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function object(obj, fn) {\n\
  for (var key in obj) {\n\
    if (has.call(obj, key)) {\n\
      fn(key, obj[key]);\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate array-ish.\n\
 *\n\
 * @param {Array|Object} obj\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function array(obj, fn) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn(obj[i], i);\n\
  }\n\
}\n\
//@ sourceURL=component-each/index.js"
));
require.register("component-event/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Bind `el` event `type` to `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, type, fn, capture){\n\
  if (el.addEventListener) {\n\
    el.addEventListener(type, fn, capture || false);\n\
  } else {\n\
    el.attachEvent('on' + type, fn);\n\
  }\n\
  return fn;\n\
};\n\
\n\
/**\n\
 * Unbind `el` event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  if (el.removeEventListener) {\n\
    el.removeEventListener(type, fn, capture || false);\n\
  } else {\n\
    el.detachEvent('on' + type, fn);\n\
  }\n\
  return fn;\n\
};\n\
//@ sourceURL=component-event/index.js"
));
require.register("component-inherit/index.js", Function("exports, require, module",
"\n\
module.exports = function(a, b){\n\
  var fn = function(){};\n\
  fn.prototype = b.prototype;\n\
  a.prototype = new fn;\n\
  a.prototype.constructor = a;\n\
};//@ sourceURL=component-inherit/index.js"
));
require.register("component-object/index.js", Function("exports, require, module",
"\n\
/**\n\
 * HOP ref.\n\
 */\n\
\n\
var has = Object.prototype.hasOwnProperty;\n\
\n\
/**\n\
 * Return own keys in `obj`.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
exports.keys = Object.keys || function(obj){\n\
  var keys = [];\n\
  for (var key in obj) {\n\
    if (has.call(obj, key)) {\n\
      keys.push(key);\n\
    }\n\
  }\n\
  return keys;\n\
};\n\
\n\
/**\n\
 * Return own values in `obj`.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
exports.values = function(obj){\n\
  var vals = [];\n\
  for (var key in obj) {\n\
    if (has.call(obj, key)) {\n\
      vals.push(obj[key]);\n\
    }\n\
  }\n\
  return vals;\n\
};\n\
\n\
/**\n\
 * Merge `b` into `a`.\n\
 *\n\
 * @param {Object} a\n\
 * @param {Object} b\n\
 * @return {Object} a\n\
 * @api public\n\
 */\n\
\n\
exports.merge = function(a, b){\n\
  for (var key in b) {\n\
    if (has.call(b, key)) {\n\
      a[key] = b[key];\n\
    }\n\
  }\n\
  return a;\n\
};\n\
\n\
/**\n\
 * Return length of `obj`.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Number}\n\
 * @api public\n\
 */\n\
\n\
exports.length = function(obj){\n\
  return exports.keys(obj).length;\n\
};\n\
\n\
/**\n\
 * Check if `obj` is empty.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
exports.isEmpty = function(obj){\n\
  return 0 == exports.length(obj);\n\
};//@ sourceURL=component-object/index.js"
));
require.register("component-trim/index.js", Function("exports, require, module",
"\n\
exports = module.exports = trim;\n\
\n\
function trim(str){\n\
  return str.replace(/^\\s*|\\s*$/g, '');\n\
}\n\
\n\
exports.left = function(str){\n\
  return str.replace(/^\\s*/, '');\n\
};\n\
\n\
exports.right = function(str){\n\
  return str.replace(/\\s*$/, '');\n\
};\n\
//@ sourceURL=component-trim/index.js"
));
require.register("component-querystring/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var trim = require('trim');\n\
\n\
/**\n\
 * Parse the given query `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Object}\n\
 * @api public\n\
 */\n\
\n\
exports.parse = function(str){\n\
  if ('string' != typeof str) return {};\n\
\n\
  str = trim(str);\n\
  if ('' == str) return {};\n\
\n\
  var obj = {};\n\
  var pairs = str.split('&');\n\
  for (var i = 0; i < pairs.length; i++) {\n\
    var parts = pairs[i].split('=');\n\
    obj[parts[0]] = null == parts[1]\n\
      ? ''\n\
      : decodeURIComponent(parts[1]);\n\
  }\n\
\n\
  return obj;\n\
};\n\
\n\
/**\n\
 * Stringify the given `obj`.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
exports.stringify = function(obj){\n\
  if (!obj) return '';\n\
  var pairs = [];\n\
  for (var key in obj) {\n\
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));\n\
  }\n\
  return pairs.join('&');\n\
};\n\
//@ sourceURL=component-querystring/index.js"
));
require.register("component-type/index.js", Function("exports, require, module",
"\n\
/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Function]': return 'function';\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object String]': return 'string';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val && val.nodeType === 1) return 'element';\n\
  if (val === Object(val)) return 'object';\n\
\n\
  return typeof val;\n\
};\n\
//@ sourceURL=component-type/index.js"
));
require.register("component-url/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Parse the given `url`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Object}\n\
 * @api public\n\
 */\n\
\n\
exports.parse = function(url){\n\
  var a = document.createElement('a');\n\
  a.href = url;\n\
  return {\n\
    href: a.href,\n\
    host: a.host || location.host,\n\
    port: ('0' === a.port || '' === a.port) ? location.port : a.port,\n\
    hash: a.hash,\n\
    hostname: a.hostname || location.hostname,\n\
    pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,\n\
    protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,\n\
    search: a.search,\n\
    query: a.search.slice(1)\n\
  };\n\
};\n\
\n\
/**\n\
 * Check if `url` is absolute.\n\
 *\n\
 * @param {String} url\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
exports.isAbsolute = function(url){\n\
  return 0 == url.indexOf('//') || !!~url.indexOf('://');\n\
};\n\
\n\
/**\n\
 * Check if `url` is relative.\n\
 *\n\
 * @param {String} url\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
exports.isRelative = function(url){\n\
  return !exports.isAbsolute(url);\n\
};\n\
\n\
/**\n\
 * Check if `url` is cross domain.\n\
 *\n\
 * @param {String} url\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
exports.isCrossDomain = function(url){\n\
  url = exports.parse(url);\n\
  return url.hostname !== location.hostname\n\
    || url.port !== location.port\n\
    || url.protocol !== location.protocol;\n\
};//@ sourceURL=component-url/index.js"
));
require.register("segmentio-after/index.js", Function("exports, require, module",
"\n\
module.exports = function after (times, func) {\n\
  // After 0, really?\n\
  if (times <= 0) return func();\n\
\n\
  // That's more like it.\n\
  return function() {\n\
    if (--times < 1) {\n\
      return func.apply(this, arguments);\n\
    }\n\
  };\n\
};//@ sourceURL=segmentio-after/index.js"
));
require.register("segmentio-alias/index.js", Function("exports, require, module",
"\n\
module.exports = function alias (object, aliases) {\n\
    // For each of our aliases, rename our object's keys.\n\
    for (var oldKey in aliases) {\n\
        var newKey = aliases[oldKey];\n\
        if (object[oldKey] !== undefined) {\n\
            object[newKey] = object[oldKey];\n\
            delete object[oldKey];\n\
        }\n\
    }\n\
};//@ sourceURL=segmentio-alias/index.js"
));
require.register("component-bind/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Slice reference.\n\
 */\n\
\n\
var slice = [].slice;\n\
\n\
/**\n\
 * Bind `obj` to `fn`.\n\
 *\n\
 * @param {Object} obj\n\
 * @param {Function|String} fn or string\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj, fn){\n\
  if ('string' == typeof fn) fn = obj[fn];\n\
  if ('function' != typeof fn) throw new Error('bind() requires a function');\n\
  var args = [].slice.call(arguments, 2);\n\
  return function(){\n\
    return fn.apply(obj, args.concat(slice.call(arguments)));\n\
  }\n\
};\n\
//@ sourceURL=component-bind/index.js"
));
require.register("segmentio-bind-all/index.js", Function("exports, require, module",
"\n\
var bind   = require('bind')\n\
  , type   = require('type');\n\
\n\
\n\
module.exports = function (obj) {\n\
  for (var key in obj) {\n\
    var val = obj[key];\n\
    if (type(val) === 'function') obj[key] = bind(obj, obj[key]);\n\
  }\n\
  return obj;\n\
};//@ sourceURL=segmentio-bind-all/index.js"
));
require.register("segmentio-canonical/index.js", Function("exports, require, module",
"module.exports = function canonical () {\n\
  var tags = document.getElementsByTagName('link');\n\
  for (var i = 0, tag; tag = tags[i]; i++) {\n\
    if ('canonical' == tag.getAttribute('rel')) return tag.getAttribute('href');\n\
  }\n\
};//@ sourceURL=segmentio-canonical/index.js"
));
require.register("segmentio-extend/index.js", Function("exports, require, module",
"\n\
module.exports = function extend (object) {\n\
    // Takes an unlimited number of extenders.\n\
    var args = Array.prototype.slice.call(arguments, 1);\n\
\n\
    // For each extender, copy their properties on our object.\n\
    for (var i = 0, source; source = args[i]; i++) {\n\
        if (!source) continue;\n\
        for (var property in source) {\n\
            object[property] = source[property];\n\
        }\n\
    }\n\
\n\
    return object;\n\
};//@ sourceURL=segmentio-extend/index.js"
));
require.register("segmentio-is-email/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `isEmail`.\n\
 */\n\
\n\
module.exports = isEmail;\n\
\n\
\n\
/**\n\
 * Email address matcher.\n\
 */\n\
\n\
var matcher = /.+\\@.+\\..+/;\n\
\n\
\n\
/**\n\
 * Loosely validate an email address.\n\
 *\n\
 * @param {String} string\n\
 * @return {Boolean}\n\
 */\n\
\n\
function isEmail (string) {\n\
  return matcher.test(string);\n\
}//@ sourceURL=segmentio-is-email/index.js"
));
require.register("segmentio-is-meta/index.js", Function("exports, require, module",
"module.exports = function isMeta (e) {\n\
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return true;\n\
\n\
    // Logic that handles checks for the middle mouse button, based\n\
    // on [jQuery](https://github.com/jquery/jquery/blob/master/src/event.js#L466).\n\
    var which = e.which, button = e.button;\n\
    if (!which && button !== undefined) {\n\
      return (!button & 1) && (!button & 2) && (button & 4);\n\
    } else if (which === 2) {\n\
      return true;\n\
    }\n\
\n\
    return false;\n\
};//@ sourceURL=segmentio-is-meta/index.js"
));
require.register("component-json-fallback/index.js", Function("exports, require, module",
"/*\n\
    json2.js\n\
    2011-10-19\n\
\n\
    Public Domain.\n\
\n\
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.\n\
\n\
    See http://www.JSON.org/js.html\n\
\n\
\n\
    This code should be minified before deployment.\n\
    See http://javascript.crockford.com/jsmin.html\n\
\n\
    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO\n\
    NOT CONTROL.\n\
\n\
\n\
    This file creates a global JSON object containing two methods: stringify\n\
    and parse.\n\
\n\
        JSON.stringify(value, replacer, space)\n\
            value       any JavaScript value, usually an object or array.\n\
\n\
            replacer    an optional parameter that determines how object\n\
                        values are stringified for objects. It can be a\n\
                        function or an array of strings.\n\
\n\
            space       an optional parameter that specifies the indentation\n\
                        of nested structures. If it is omitted, the text will\n\
                        be packed without extra whitespace. If it is a number,\n\
                        it will specify the number of spaces to indent at each\n\
                        level. If it is a string (such as '\\t' or '&nbsp;'),\n\
                        it contains the characters used to indent at each level.\n\
\n\
            This method produces a JSON text from a JavaScript value.\n\
\n\
            When an object value is found, if the object contains a toJSON\n\
            method, its toJSON method will be called and the result will be\n\
            stringified. A toJSON method does not serialize: it returns the\n\
            value represented by the name/value pair that should be serialized,\n\
            or undefined if nothing should be serialized. The toJSON method\n\
            will be passed the key associated with the value, and this will be\n\
            bound to the value\n\
\n\
            For example, this would serialize Dates as ISO strings.\n\
\n\
                Date.prototype.toJSON = function (key) {\n\
                    function f(n) {\n\
                        // Format integers to have at least two digits.\n\
                        return n < 10 ? '0' + n : n;\n\
                    }\n\
\n\
                    return this.getUTCFullYear()   + '-' +\n\
                         f(this.getUTCMonth() + 1) + '-' +\n\
                         f(this.getUTCDate())      + 'T' +\n\
                         f(this.getUTCHours())     + ':' +\n\
                         f(this.getUTCMinutes())   + ':' +\n\
                         f(this.getUTCSeconds())   + 'Z';\n\
                };\n\
\n\
            You can provide an optional replacer method. It will be passed the\n\
            key and value of each member, with this bound to the containing\n\
            object. The value that is returned from your method will be\n\
            serialized. If your method returns undefined, then the member will\n\
            be excluded from the serialization.\n\
\n\
            If the replacer parameter is an array of strings, then it will be\n\
            used to select the members to be serialized. It filters the results\n\
            such that only members with keys listed in the replacer array are\n\
            stringified.\n\
\n\
            Values that do not have JSON representations, such as undefined or\n\
            functions, will not be serialized. Such values in objects will be\n\
            dropped; in arrays they will be replaced with null. You can use\n\
            a replacer function to replace those with JSON values.\n\
            JSON.stringify(undefined) returns undefined.\n\
\n\
            The optional space parameter produces a stringification of the\n\
            value that is filled with line breaks and indentation to make it\n\
            easier to read.\n\
\n\
            If the space parameter is a non-empty string, then that string will\n\
            be used for indentation. If the space parameter is a number, then\n\
            the indentation will be that many spaces.\n\
\n\
            Example:\n\
\n\
            text = JSON.stringify(['e', {pluribus: 'unum'}]);\n\
            // text is '[\"e\",{\"pluribus\":\"unum\"}]'\n\
\n\
\n\
            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\\t');\n\
            // text is '[\\n\
\\t\"e\",\\n\
\\t{\\n\
\\t\\t\"pluribus\": \"unum\"\\n\
\\t}\\n\
]'\n\
\n\
            text = JSON.stringify([new Date()], function (key, value) {\n\
                return this[key] instanceof Date ?\n\
                    'Date(' + this[key] + ')' : value;\n\
            });\n\
            // text is '[\"Date(---current time---)\"]'\n\
\n\
\n\
        JSON.parse(text, reviver)\n\
            This method parses a JSON text to produce an object or array.\n\
            It can throw a SyntaxError exception.\n\
\n\
            The optional reviver parameter is a function that can filter and\n\
            transform the results. It receives each of the keys and values,\n\
            and its return value is used instead of the original value.\n\
            If it returns what it received, then the structure is not modified.\n\
            If it returns undefined then the member is deleted.\n\
\n\
            Example:\n\
\n\
            // Parse the text. Values that look like ISO date strings will\n\
            // be converted to Date objects.\n\
\n\
            myData = JSON.parse(text, function (key, value) {\n\
                var a;\n\
                if (typeof value === 'string') {\n\
                    a =\n\
/^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2}(?:\\.\\d*)?)Z$/.exec(value);\n\
                    if (a) {\n\
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],\n\
                            +a[5], +a[6]));\n\
                    }\n\
                }\n\
                return value;\n\
            });\n\
\n\
            myData = JSON.parse('[\"Date(09/09/2001)\"]', function (key, value) {\n\
                var d;\n\
                if (typeof value === 'string' &&\n\
                        value.slice(0, 5) === 'Date(' &&\n\
                        value.slice(-1) === ')') {\n\
                    d = new Date(value.slice(5, -1));\n\
                    if (d) {\n\
                        return d;\n\
                    }\n\
                }\n\
                return value;\n\
            });\n\
\n\
\n\
    This is a reference implementation. You are free to copy, modify, or\n\
    redistribute.\n\
*/\n\
\n\
/*jslint evil: true, regexp: true */\n\
\n\
/*members \"\", \"\\b\", \"\\t\", \"\\n\
\", \"\\f\", \"\\r\", \"\\\"\", JSON, \"\\\\\", apply,\n\
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,\n\
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,\n\
    lastIndex, length, parse, prototype, push, replace, slice, stringify,\n\
    test, toJSON, toString, valueOf\n\
*/\n\
\n\
\n\
// Create a JSON object only if one does not already exist. We create the\n\
// methods in a closure to avoid creating global variables.\n\
\n\
var JSON = {};\n\
\n\
(function () {\n\
    'use strict';\n\
\n\
    function f(n) {\n\
        // Format integers to have at least two digits.\n\
        return n < 10 ? '0' + n : n;\n\
    }\n\
\n\
    if (typeof Date.prototype.toJSON !== 'function') {\n\
\n\
        Date.prototype.toJSON = function (key) {\n\
\n\
            return isFinite(this.valueOf())\n\
                ? this.getUTCFullYear()     + '-' +\n\
                    f(this.getUTCMonth() + 1) + '-' +\n\
                    f(this.getUTCDate())      + 'T' +\n\
                    f(this.getUTCHours())     + ':' +\n\
                    f(this.getUTCMinutes())   + ':' +\n\
                    f(this.getUTCSeconds())   + 'Z'\n\
                : null;\n\
        };\n\
\n\
        String.prototype.toJSON      =\n\
            Number.prototype.toJSON  =\n\
            Boolean.prototype.toJSON = function (key) {\n\
                return this.valueOf();\n\
            };\n\
    }\n\
\n\
    var cx = /[\\u0000\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g,\n\
        escapable = /[\\\\\\\"\\x00-\\x1f\\x7f-\\x9f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g,\n\
        gap,\n\
        indent,\n\
        meta = {    // table of character substitutions\n\
            '\\b': '\\\\b',\n\
            '\\t': '\\\\t',\n\
            '\\n\
': '\\\\n\
',\n\
            '\\f': '\\\\f',\n\
            '\\r': '\\\\r',\n\
            '\"' : '\\\\\"',\n\
            '\\\\': '\\\\\\\\'\n\
        },\n\
        rep;\n\
\n\
\n\
    function quote(string) {\n\
\n\
// If the string contains no control characters, no quote characters, and no\n\
// backslash characters, then we can safely slap some quotes around it.\n\
// Otherwise we must also replace the offending characters with safe escape\n\
// sequences.\n\
\n\
        escapable.lastIndex = 0;\n\
        return escapable.test(string) ? '\"' + string.replace(escapable, function (a) {\n\
            var c = meta[a];\n\
            return typeof c === 'string'\n\
                ? c\n\
                : '\\\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);\n\
        }) + '\"' : '\"' + string + '\"';\n\
    }\n\
\n\
\n\
    function str(key, holder) {\n\
\n\
// Produce a string from holder[key].\n\
\n\
        var i,          // The loop counter.\n\
            k,          // The member key.\n\
            v,          // The member value.\n\
            length,\n\
            mind = gap,\n\
            partial,\n\
            value = holder[key];\n\
\n\
// If the value has a toJSON method, call it to obtain a replacement value.\n\
\n\
        if (value && typeof value === 'object' &&\n\
                typeof value.toJSON === 'function') {\n\
            value = value.toJSON(key);\n\
        }\n\
\n\
// If we were called with a replacer function, then call the replacer to\n\
// obtain a replacement value.\n\
\n\
        if (typeof rep === 'function') {\n\
            value = rep.call(holder, key, value);\n\
        }\n\
\n\
// What happens next depends on the value's type.\n\
\n\
        switch (typeof value) {\n\
        case 'string':\n\
            return quote(value);\n\
\n\
        case 'number':\n\
\n\
// JSON numbers must be finite. Encode non-finite numbers as null.\n\
\n\
            return isFinite(value) ? String(value) : 'null';\n\
\n\
        case 'boolean':\n\
        case 'null':\n\
\n\
// If the value is a boolean or null, convert it to a string. Note:\n\
// typeof null does not produce 'null'. The case is included here in\n\
// the remote chance that this gets fixed someday.\n\
\n\
            return String(value);\n\
\n\
// If the type is 'object', we might be dealing with an object or an array or\n\
// null.\n\
\n\
        case 'object':\n\
\n\
// Due to a specification blunder in ECMAScript, typeof null is 'object',\n\
// so watch out for that case.\n\
\n\
            if (!value) {\n\
                return 'null';\n\
            }\n\
\n\
// Make an array to hold the partial results of stringifying this object value.\n\
\n\
            gap += indent;\n\
            partial = [];\n\
\n\
// Is the value an array?\n\
\n\
            if (Object.prototype.toString.apply(value) === '[object Array]') {\n\
\n\
// The value is an array. Stringify every element. Use null as a placeholder\n\
// for non-JSON values.\n\
\n\
                length = value.length;\n\
                for (i = 0; i < length; i += 1) {\n\
                    partial[i] = str(i, value) || 'null';\n\
                }\n\
\n\
// Join all of the elements together, separated with commas, and wrap them in\n\
// brackets.\n\
\n\
                v = partial.length === 0\n\
                    ? '[]'\n\
                    : gap\n\
                    ? '[\\n\
' + gap + partial.join(',\\n\
' + gap) + '\\n\
' + mind + ']'\n\
                    : '[' + partial.join(',') + ']';\n\
                gap = mind;\n\
                return v;\n\
            }\n\
\n\
// If the replacer is an array, use it to select the members to be stringified.\n\
\n\
            if (rep && typeof rep === 'object') {\n\
                length = rep.length;\n\
                for (i = 0; i < length; i += 1) {\n\
                    if (typeof rep[i] === 'string') {\n\
                        k = rep[i];\n\
                        v = str(k, value);\n\
                        if (v) {\n\
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);\n\
                        }\n\
                    }\n\
                }\n\
            } else {\n\
\n\
// Otherwise, iterate through all of the keys in the object.\n\
\n\
                for (k in value) {\n\
                    if (Object.prototype.hasOwnProperty.call(value, k)) {\n\
                        v = str(k, value);\n\
                        if (v) {\n\
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);\n\
                        }\n\
                    }\n\
                }\n\
            }\n\
\n\
// Join all of the member texts together, separated with commas,\n\
// and wrap them in braces.\n\
\n\
            v = partial.length === 0\n\
                ? '{}'\n\
                : gap\n\
                ? '{\\n\
' + gap + partial.join(',\\n\
' + gap) + '\\n\
' + mind + '}'\n\
                : '{' + partial.join(',') + '}';\n\
            gap = mind;\n\
            return v;\n\
        }\n\
    }\n\
\n\
// If the JSON object does not yet have a stringify method, give it one.\n\
\n\
    if (typeof JSON.stringify !== 'function') {\n\
        JSON.stringify = function (value, replacer, space) {\n\
\n\
// The stringify method takes a value and an optional replacer, and an optional\n\
// space parameter, and returns a JSON text. The replacer can be a function\n\
// that can replace values, or an array of strings that will select the keys.\n\
// A default replacer method can be provided. Use of the space parameter can\n\
// produce text that is more easily readable.\n\
\n\
            var i;\n\
            gap = '';\n\
            indent = '';\n\
\n\
// If the space parameter is a number, make an indent string containing that\n\
// many spaces.\n\
\n\
            if (typeof space === 'number') {\n\
                for (i = 0; i < space; i += 1) {\n\
                    indent += ' ';\n\
                }\n\
\n\
// If the space parameter is a string, it will be used as the indent string.\n\
\n\
            } else if (typeof space === 'string') {\n\
                indent = space;\n\
            }\n\
\n\
// If there is a replacer, it must be a function or an array.\n\
// Otherwise, throw an error.\n\
\n\
            rep = replacer;\n\
            if (replacer && typeof replacer !== 'function' &&\n\
                    (typeof replacer !== 'object' ||\n\
                    typeof replacer.length !== 'number')) {\n\
                throw new Error('JSON.stringify');\n\
            }\n\
\n\
// Make a fake root object containing our value under the key of ''.\n\
// Return the result of stringifying the value.\n\
\n\
            return str('', {'': value});\n\
        };\n\
    }\n\
\n\
\n\
// If the JSON object does not yet have a parse method, give it one.\n\
\n\
    if (typeof JSON.parse !== 'function') {\n\
        JSON.parse = function (text, reviver) {\n\
\n\
// The parse method takes a text and an optional reviver function, and returns\n\
// a JavaScript value if the text is a valid JSON text.\n\
\n\
            var j;\n\
\n\
            function walk(holder, key) {\n\
\n\
// The walk method is used to recursively walk the resulting structure so\n\
// that modifications can be made.\n\
\n\
                var k, v, value = holder[key];\n\
                if (value && typeof value === 'object') {\n\
                    for (k in value) {\n\
                        if (Object.prototype.hasOwnProperty.call(value, k)) {\n\
                            v = walk(value, k);\n\
                            if (v !== undefined) {\n\
                                value[k] = v;\n\
                            } else {\n\
                                delete value[k];\n\
                            }\n\
                        }\n\
                    }\n\
                }\n\
                return reviver.call(holder, key, value);\n\
            }\n\
\n\
\n\
// Parsing happens in four stages. In the first stage, we replace certain\n\
// Unicode characters with escape sequences. JavaScript handles many characters\n\
// incorrectly, either silently deleting them, or treating them as line endings.\n\
\n\
            text = String(text);\n\
            cx.lastIndex = 0;\n\
            if (cx.test(text)) {\n\
                text = text.replace(cx, function (a) {\n\
                    return '\\\\u' +\n\
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);\n\
                });\n\
            }\n\
\n\
// In the second stage, we run the text against regular expressions that look\n\
// for non-JSON patterns. We are especially concerned with '()' and 'new'\n\
// because they can cause invocation, and '=' because it can cause mutation.\n\
// But just to be safe, we want to reject all unexpected forms.\n\
\n\
// We split the second stage into 4 regexp operations in order to work around\n\
// crippling inefficiencies in IE's and Safari's regexp engines. First we\n\
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we\n\
// replace all simple value tokens with ']' characters. Third, we delete all\n\
// open brackets that follow a colon or comma or that begin the text. Finally,\n\
// we look to see that the remaining characters are only whitespace or ']' or\n\
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.\n\
\n\
            if (/^[\\],:{}\\s]*$/\n\
                    .test(text.replace(/\\\\(?:[\"\\\\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')\n\
                        .replace(/\"[^\"\\\\\\n\
\\r]*\"|true|false|null|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?/g, ']')\n\
                        .replace(/(?:^|:|,)(?:\\s*\\[)+/g, ''))) {\n\
\n\
// In the third stage we use the eval function to compile the text into a\n\
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity\n\
// in JavaScript: it can begin a block or an object literal. We wrap the text\n\
// in parens to eliminate the ambiguity.\n\
\n\
                j = eval('(' + text + ')');\n\
\n\
// In the optional fourth stage, we recursively walk the new structure, passing\n\
// each name/value pair to a reviver function for possible transformation.\n\
\n\
                return typeof reviver === 'function'\n\
                    ? walk({'': j}, '')\n\
                    : j;\n\
            }\n\
\n\
// If the text is not JSON parseable, then a SyntaxError is thrown.\n\
\n\
            throw new SyntaxError('JSON.parse');\n\
        };\n\
    }\n\
}());\n\
\n\
module.exports = JSON//@ sourceURL=component-json-fallback/index.js"
));
require.register("segmentio-json/index.js", Function("exports, require, module",
"\n\
module.exports = 'undefined' == typeof JSON\n\
  ? require('json-fallback')\n\
  : JSON;\n\
//@ sourceURL=segmentio-json/index.js"
));
require.register("segmentio-load-date/index.js", Function("exports, require, module",
"\n\
\n\
/*\n\
 * Load date.\n\
 *\n\
 * For reference: http://www.html5rocks.com/en/tutorials/webperformance/basics/\n\
 */\n\
\n\
var time = new Date()\n\
  , perf = window.performance;\n\
\n\
if (perf && perf.timing && perf.timing.responseEnd) {\n\
  time = new Date(perf.timing.responseEnd);\n\
}\n\
\n\
module.exports = time;//@ sourceURL=segmentio-load-date/index.js"
));
require.register("segmentio-load-script/index.js", Function("exports, require, module",
"var type = require('type');\n\
\n\
\n\
module.exports = function loadScript (options, callback) {\n\
    if (!options) throw new Error('Cant load nothing...');\n\
\n\
    // Allow for the simplest case, just passing a `src` string.\n\
    if (type(options) === 'string') options = { src : options };\n\
\n\
    var https = document.location.protocol === 'https:' ||\n\
                document.location.protocol === 'chrome-extension:';\n\
\n\
    // If you use protocol relative URLs, third-party scripts like Google\n\
    // Analytics break when testing with `file:` so this fixes that.\n\
    if (options.src && options.src.indexOf('//') === 0) {\n\
        options.src = https ? 'https:' + options.src : 'http:' + options.src;\n\
    }\n\
\n\
    // Allow them to pass in different URLs depending on the protocol.\n\
    if (https && options.https) options.src = options.https;\n\
    else if (!https && options.http) options.src = options.http;\n\
\n\
    // Make the `<script>` element and insert it before the first script on the\n\
    // page, which is guaranteed to exist since this Javascript is running.\n\
    var script = document.createElement('script');\n\
    script.type = 'text/javascript';\n\
    script.async = true;\n\
    script.src = options.src;\n\
\n\
    var firstScript = document.getElementsByTagName('script')[0];\n\
    firstScript.parentNode.insertBefore(script, firstScript);\n\
\n\
    // If we have a callback, attach event handlers, even in IE. Based off of\n\
    // the Third-Party Javascript script loading example:\n\
    // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html\n\
    if (callback && type(callback) === 'function') {\n\
        if (script.addEventListener) {\n\
            script.addEventListener('load', callback, false);\n\
        } else if (script.attachEvent) {\n\
            script.attachEvent('onreadystatechange', function () {\n\
                if (/complete|loaded/.test(script.readyState)) callback();\n\
            });\n\
        }\n\
    }\n\
\n\
    // Return the script element in case they want to do anything special, like\n\
    // give it an ID or attributes.\n\
    return script;\n\
};\n\
//@ sourceURL=segmentio-load-script/index.js"
));
require.register("segmentio-type/index.js", Function("exports, require, module",
"\n\
/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Function]': return 'function';\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object String]': return 'string';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val && val.nodeType === 1) return 'element';\n\
  if (val === Object(val)) return 'object';\n\
\n\
  return typeof val;\n\
};\n\
//@ sourceURL=segmentio-type/index.js"
));
require.register("segmentio-new-date/index.js", Function("exports, require, module",
"var type = require('type');\n\
\n\
\n\
/**\n\
 * Returns a new Javascript Date object, allowing a variety of extra input types\n\
 * over the native one.\n\
 *\n\
 * @param {Date|String|Number} input\n\
 */\n\
\n\
module.exports = function newDate (input) {\n\
\n\
  // Convert input from seconds to milliseconds.\n\
  input = toMilliseconds(input);\n\
\n\
  // By default, delegate to Date, which will return `Invalid Date`s if wrong.\n\
  var date = new Date(input);\n\
\n\
  // If we have a string that the Date constructor couldn't parse, convert it.\n\
  if (isNaN(date.getTime()) && 'string' === type(input)) {\n\
    var milliseconds = toMilliseconds(parseInt(input, 10));\n\
    date = new Date(milliseconds);\n\
  }\n\
\n\
  return date;\n\
};\n\
\n\
\n\
/**\n\
 * If the number passed in is seconds from the epoch, turn it into milliseconds.\n\
 * Milliseconds would be greater than 31557600000 (December 31, 1970).\n\
 *\n\
 * @param seconds\n\
 */\n\
\n\
function toMilliseconds (seconds) {\n\
  if ('number' === type(seconds) && seconds < 31557600000) return seconds * 1000;\n\
  return seconds;\n\
}//@ sourceURL=segmentio-new-date/index.js"
));
require.register("segmentio-on-body/index.js", Function("exports, require, module",
"var each = require('each');\n\
\n\
\n\
/**\n\
 * Cache whether `<body>` exists.\n\
 */\n\
\n\
var body = false;\n\
\n\
\n\
/**\n\
 * Callbacks to call when the body exists.\n\
 */\n\
\n\
var callbacks = [];\n\
\n\
\n\
/**\n\
 * Export a way to add handlers to be invoked once the body exists.\n\
 *\n\
 * @param {Function} callback  A function to call when the body exists.\n\
 */\n\
\n\
module.exports = function onBody (callback) {\n\
  if (body) {\n\
    call(callback);\n\
  } else {\n\
    callbacks.push(callback);\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Set an interval to check for `document.body`.\n\
 */\n\
\n\
var interval = setInterval(function () {\n\
  if (!document.body) return;\n\
  body = true;\n\
  each(callbacks, call);\n\
  clearInterval(interval);\n\
}, 5);\n\
\n\
\n\
/**\n\
 * Call a callback, passing it the body.\n\
 *\n\
 * @param {Function} callback  The callback to call.\n\
 */\n\
\n\
function call (callback) {\n\
  callback(document.body);\n\
}//@ sourceURL=segmentio-on-body/index.js"
));
require.register("segmentio-store.js/store.js", Function("exports, require, module",
"var json             = require('json')\n\
  , store            = {}\n\
  , win              = window\n\
\t,\tdoc              = win.document\n\
\t,\tlocalStorageName = 'localStorage'\n\
\t,\tnamespace        = '__storejs__'\n\
\t,\tstorage;\n\
\n\
store.disabled = false\n\
store.set = function(key, value) {}\n\
store.get = function(key) {}\n\
store.remove = function(key) {}\n\
store.clear = function() {}\n\
store.transact = function(key, defaultVal, transactionFn) {\n\
\tvar val = store.get(key)\n\
\tif (transactionFn == null) {\n\
\t\ttransactionFn = defaultVal\n\
\t\tdefaultVal = null\n\
\t}\n\
\tif (typeof val == 'undefined') { val = defaultVal || {} }\n\
\ttransactionFn(val)\n\
\tstore.set(key, val)\n\
}\n\
store.getAll = function() {}\n\
\n\
store.serialize = function(value) {\n\
\treturn json.stringify(value)\n\
}\n\
store.deserialize = function(value) {\n\
\tif (typeof value != 'string') { return undefined }\n\
\ttry { return json.parse(value) }\n\
\tcatch(e) { return value || undefined }\n\
}\n\
\n\
// Functions to encapsulate questionable FireFox 3.6.13 behavior\n\
// when about.config::dom.storage.enabled === false\n\
// See https://github.com/marcuswestin/store.js/issues#issue/13\n\
function isLocalStorageNameSupported() {\n\
\ttry { return (localStorageName in win && win[localStorageName]) }\n\
\tcatch(err) { return false }\n\
}\n\
\n\
if (isLocalStorageNameSupported()) {\n\
\tstorage = win[localStorageName]\n\
\tstore.set = function(key, val) {\n\
\t\tif (val === undefined) { return store.remove(key) }\n\
\t\tstorage.setItem(key, store.serialize(val))\n\
\t\treturn val\n\
\t}\n\
\tstore.get = function(key) { return store.deserialize(storage.getItem(key)) }\n\
\tstore.remove = function(key) { storage.removeItem(key) }\n\
\tstore.clear = function() { storage.clear() }\n\
\tstore.getAll = function() {\n\
\t\tvar ret = {}\n\
\t\tfor (var i=0; i<storage.length; ++i) {\n\
\t\t\tvar key = storage.key(i)\n\
\t\t\tret[key] = store.get(key)\n\
\t\t}\n\
\t\treturn ret\n\
\t}\n\
} else if (doc.documentElement.addBehavior) {\n\
\tvar storageOwner,\n\
\t\tstorageContainer\n\
\t// Since #userData storage applies only to specific paths, we need to\n\
\t// somehow link our data to a specific path.  We choose /favicon.ico\n\
\t// as a pretty safe option, since all browsers already make a request to\n\
\t// this URL anyway and being a 404 will not hurt us here.  We wrap an\n\
\t// iframe pointing to the favicon in an ActiveXObject(htmlfile) object\n\
\t// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)\n\
\t// since the iframe access rules appear to allow direct access and\n\
\t// manipulation of the document element, even for a 404 page.  This\n\
\t// document can be used instead of the current document (which would\n\
\t// have been limited to the current path) to perform #userData storage.\n\
\ttry {\n\
\t\tstorageContainer = new ActiveXObject('htmlfile')\n\
\t\tstorageContainer.open()\n\
\t\tstorageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src=\"/favicon.ico\"></iframe>')\n\
\t\tstorageContainer.close()\n\
\t\tstorageOwner = storageContainer.w.frames[0].document\n\
\t\tstorage = storageOwner.createElement('div')\n\
\t} catch(e) {\n\
\t\t// somehow ActiveXObject instantiation failed (perhaps some special\n\
\t\t// security settings or otherwse), fall back to per-path storage\n\
\t\tstorage = doc.createElement('div')\n\
\t\tstorageOwner = doc.body\n\
\t}\n\
\tfunction withIEStorage(storeFunction) {\n\
\t\treturn function() {\n\
\t\t\tvar args = Array.prototype.slice.call(arguments, 0)\n\
\t\t\targs.unshift(storage)\n\
\t\t\t// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx\n\
\t\t\t// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx\n\
\t\t\tstorageOwner.appendChild(storage)\n\
\t\t\tstorage.addBehavior('#default#userData')\n\
\t\t\tstorage.load(localStorageName)\n\
\t\t\tvar result = storeFunction.apply(store, args)\n\
\t\t\tstorageOwner.removeChild(storage)\n\
\t\t\treturn result\n\
\t\t}\n\
\t}\n\
\n\
\t// In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40\n\
\tvar forbiddenCharsRegex = new RegExp(\"[!\\\"#$%&'()*+,/\\\\\\\\:;<=>?@[\\\\]^`{|}~]\", \"g\")\n\
\tfunction ieKeyFix(key) {\n\
\t\treturn key.replace(forbiddenCharsRegex, '___')\n\
\t}\n\
\tstore.set = withIEStorage(function(storage, key, val) {\n\
\t\tkey = ieKeyFix(key)\n\
\t\tif (val === undefined) { return store.remove(key) }\n\
\t\tstorage.setAttribute(key, store.serialize(val))\n\
\t\tstorage.save(localStorageName)\n\
\t\treturn val\n\
\t})\n\
\tstore.get = withIEStorage(function(storage, key) {\n\
\t\tkey = ieKeyFix(key)\n\
\t\treturn store.deserialize(storage.getAttribute(key))\n\
\t})\n\
\tstore.remove = withIEStorage(function(storage, key) {\n\
\t\tkey = ieKeyFix(key)\n\
\t\tstorage.removeAttribute(key)\n\
\t\tstorage.save(localStorageName)\n\
\t})\n\
\tstore.clear = withIEStorage(function(storage) {\n\
\t\tvar attributes = storage.XMLDocument.documentElement.attributes\n\
\t\tstorage.load(localStorageName)\n\
\t\tfor (var i=0, attr; attr=attributes[i]; i++) {\n\
\t\t\tstorage.removeAttribute(attr.name)\n\
\t\t}\n\
\t\tstorage.save(localStorageName)\n\
\t})\n\
\tstore.getAll = withIEStorage(function(storage) {\n\
\t\tvar attributes = storage.XMLDocument.documentElement.attributes\n\
\t\tvar ret = {}\n\
\t\tfor (var i=0, attr; attr=attributes[i]; ++i) {\n\
\t\t\tvar key = ieKeyFix(attr.name)\n\
\t\t\tret[attr.name] = store.deserialize(storage.getAttribute(key))\n\
\t\t}\n\
\t\treturn ret\n\
\t})\n\
}\n\
\n\
try {\n\
\tstore.set(namespace, namespace)\n\
\tif (store.get(namespace) != namespace) { store.disabled = true }\n\
\tstore.remove(namespace)\n\
} catch(e) {\n\
\tstore.disabled = true\n\
}\n\
store.enabled = !store.disabled\n\
\n\
module.exports = store;//@ sourceURL=segmentio-store.js/store.js"
));
require.register("segmentio-top-domain/index.js", Function("exports, require, module",
"\n\
var url = require('url');\n\
\n\
// Official Grammar: http://tools.ietf.org/html/rfc883#page-56\n\
// Look for tlds with up to 2-6 characters.\n\
\n\
module.exports = function (urlStr) {\n\
\n\
  var host     = url.parse(urlStr).hostname\n\
    , topLevel = host.match(/[a-z0-9][a-z0-9\\-]*[a-z0-9]\\.[a-z\\.]{2,6}$/i);\n\
\n\
  return topLevel ? topLevel[0] : host;\n\
};//@ sourceURL=segmentio-top-domain/index.js"
));
require.register("timoxley-next-tick/index.js", Function("exports, require, module",
"\"use strict\"\n\
\n\
if (typeof setImmediate == 'function') {\n\
  module.exports = function(f){ setImmediate(f) }\n\
}\n\
// legacy node.js\n\
else if (typeof process != 'undefined' && typeof process.nextTick == 'function') {\n\
  module.exports = process.nextTick\n\
}\n\
// fallback for other environments / postMessage behaves badly on IE8\n\
else if (typeof window == 'undefined' || window.ActiveXObject || !window.postMessage) {\n\
  module.exports = function(f){ setTimeout(f) };\n\
} else {\n\
  var q = [];\n\
\n\
  window.addEventListener('message', function(){\n\
    var i = 0;\n\
    while (i < q.length) {\n\
      try { q[i++](); }\n\
      catch (e) {\n\
        q = q.slice(i);\n\
        window.postMessage('tic!', '*');\n\
        throw e;\n\
      }\n\
    }\n\
    q.length = 0;\n\
  }, true);\n\
\n\
  module.exports = function(fn){\n\
    if (!q.length) window.postMessage('tic!', '*');\n\
    q.push(fn);\n\
  }\n\
}\n\
//@ sourceURL=timoxley-next-tick/index.js"
));
require.register("yields-prevent/index.js", Function("exports, require, module",
"\n\
/**\n\
 * prevent default on the given `e`.\n\
 * \n\
 * examples:\n\
 * \n\
 *      anchor.onclick = prevent;\n\
 *      anchor.onclick = function(e){\n\
 *        if (something) return prevent(e);\n\
 *      };\n\
 * \n\
 * @param {Event} e\n\
 */\n\
\n\
module.exports = function(e){\n\
  e = e || window.event\n\
  return e.preventDefault\n\
    ? e.preventDefault()\n\
    : e.returnValue = false;\n\
};\n\
//@ sourceURL=yields-prevent/index.js"
));
require.register("analytics/src/index.js", Function("exports, require, module",
"// Analytics.js\n\
//\n\
// (c) 2013 Segment.io Inc.\n\
// Analytics.js may be freely distributed under the MIT license.\n\
\n\
var Analytics = require('./analytics')\n\
  , providers = require('./providers');\n\
\n\
\n\
module.exports = new Analytics(providers);//@ sourceURL=analytics/src/index.js"
));
require.register("analytics/src/analytics.js", Function("exports, require, module",
"var after          = require('after')\n\
  , bind           = require('event').bind\n\
  , clone          = require('clone')\n\
  , cookie         = require('./cookie')\n\
  , each           = require('each')\n\
  , extend         = require('extend')\n\
  , isEmail        = require('is-email')\n\
  , isMeta         = require('is-meta')\n\
  , localStore     = require('./localStore')\n\
  , newDate        = require('new-date')\n\
  , size           = require('object').length\n\
  , preventDefault = require('prevent')\n\
  , Provider       = require('./provider')\n\
  , providers      = require('./providers')\n\
  , querystring    = require('querystring')\n\
  , type           = require('type')\n\
  , url            = require('url')\n\
  , user           = require('./user')\n\
  , utils          = require('./utils');\n\
\n\
\n\
module.exports = Analytics;\n\
\n\
\n\
/**\n\
 * Analytics.\n\
 *\n\
 * @param {Object} Providers - Provider classes that the user can initialize.\n\
 */\n\
\n\
function Analytics (Providers) {\n\
  var self = this;\n\
\n\
  this.VERSION = '0.11.11';\n\
\n\
  each(Providers, function (Provider) {\n\
    self.addProvider(Provider);\n\
  });\n\
\n\
  // Wrap `onload` with our own that will cache the loaded state of the page.\n\
  var oldonload = window.onload;\n\
  window.onload = function () {\n\
    self.loaded = true;\n\
    if ('function' === type(oldonload)) oldonload();\n\
  };\n\
}\n\
\n\
\n\
/**\n\
 * Extend the Analytics prototype.\n\
 */\n\
\n\
extend(Analytics.prototype, {\n\
\n\
  // Whether `onload` has fired.\n\
  loaded : false,\n\
\n\
  // Whether `analytics` has been initialized.\n\
  initialized : false,\n\
\n\
  // Whether all of our analytics providers are ready to accept calls. Give it a\n\
  // real jank name since we already use `analytics.ready` for the method.\n\
  readied : false,\n\
\n\
  // A queue for ready callbacks to run when our `readied` state becomes `true`.\n\
  callbacks : [],\n\
\n\
  // Milliseconds to wait for requests to clear before leaving the current page.\n\
  timeout : 300,\n\
\n\
  // A reference to the current user object.\n\
  user : user,\n\
\n\
  // The default Provider.\n\
  Provider : Provider,\n\
\n\
  // Providers that can be initialized. Add using `this.addProvider`.\n\
  _providers : {},\n\
\n\
  // The currently initialized providers.\n\
  providers : [],\n\
\n\
\n\
  /**\n\
   * Add a provider to `_providers` to be initialized later.\n\
   *\n\
   * @param {String} name - The name of the provider.\n\
   * @param {Function} Provider - The provider's class.\n\
   */\n\
\n\
  addProvider : function (Provider) {\n\
    this._providers[Provider.prototype.name] = Provider;\n\
  },\n\
\n\
\n\
  /**\n\
   * Initialize\n\
   *\n\
   * Call `initialize` to setup analytics.js before identifying or\n\
   * tracking any users or events. For example:\n\
   *\n\
   *     analytics.initialize({\n\
   *         'Google Analytics' : 'UA-XXXXXXX-X',\n\
   *         'Segment.io'       : 'XXXXXXXXXXX',\n\
   *         'KISSmetrics'      : 'XXXXXXXXXXX'\n\
   *     });\n\
   *\n\
   * @param {Object} providers - a dictionary of the providers you want to\n\
   * enable. The keys are the names of the providers and their values are either\n\
   * an api key, or  dictionary of extra settings (including the api key).\n\
   *\n\
   * @param {Object} options (optional) - extra settings to initialize with.\n\
   */\n\
\n\
  initialize : function (providers, options) {\n\
    options || (options = {});\n\
\n\
    var self = this;\n\
\n\
    // Reset our state.\n\
    this.providers = [];\n\
    this.initialized = false;\n\
    this.readied = false;\n\
\n\
    // Set the storage options\n\
    cookie.options(options.cookie);\n\
    localStore.options(options.localStorage);\n\
\n\
    // Set the options for loading and saving the user\n\
    user.options(options.user);\n\
    user.load();\n\
\n\
    // Create a ready method that will call all of our ready callbacks after all\n\
    // of our providers have been initialized and loaded. We'll pass the\n\
    // function into each provider's initialize method, so they can callback\n\
    // after they've loaded successfully.\n\
    var ready = after(size(providers), function () {\n\
      self.readied = true;\n\
      var callback;\n\
      while(callback = self.callbacks.shift()) {\n\
        callback();\n\
      }\n\
    });\n\
\n\
    // Initialize a new instance of each provider with their `options`, and\n\
    // copy the provider into `this.providers`.\n\
    each(providers, function (key, options) {\n\
      var Provider = self._providers[key];\n\
      if (!Provider) return;\n\
      self.providers.push(new Provider(options, ready, self));\n\
    });\n\
\n\
    // Identify and track any `ajs_uid` and `ajs_event` parameters in the URL.\n\
    var query = url.parse(window.location.href).query;\n\
    var queries = querystring.parse(query);\n\
    if (queries.ajs_uid) this.identify(queries.ajs_uid);\n\
    if (queries.ajs_event) this.track(queries.ajs_event);\n\
\n\
    // Update the initialized state that other methods rely on.\n\
    this.initialized = true;\n\
  },\n\
\n\
\n\
  /**\n\
   * Ready\n\
   *\n\
   * Add a callback that will get called when all of the analytics services you\n\
   * initialize are ready to be called. It's like jQuery's `ready` except for\n\
   * analytics instead of the DOM.\n\
   *\n\
   * If we're already ready, it will callback immediately.\n\
   *\n\
   * @param {Function} callback - The callback to attach.\n\
   */\n\
\n\
  ready : function (callback) {\n\
    if (type(callback) !== 'function') return;\n\
    if (this.readied) return callback();\n\
    this.callbacks.push(callback);\n\
  },\n\
\n\
\n\
  /**\n\
   * Identify\n\
   *\n\
   * Identifying a user ties all of their actions to an ID you recognize\n\
   * and records properties about a user. For example:\n\
   *\n\
   *     analytics.identify('4d3ed089fb60ab534684b7e0', {\n\
   *         name  : 'Achilles',\n\
   *         email : 'achilles@segment.io',\n\
   *         age   : 23\n\
   *     });\n\
   *\n\
   * @param {String} userId (optional) - The ID you recognize the user by.\n\
   * Ideally this isn't an email, because that might change in the future.\n\
   *\n\
   * @param {Object} traits (optional) - A dictionary of traits you know about\n\
   * the user. Things like `name`, `age`, etc.\n\
   *\n\
   * @param {Object} options (optional) - Settings for the identify call.\n\
   *\n\
   * @param {Function} callback (optional) - A function to call after a small\n\
   * timeout, giving the identify call time to make requests.\n\
   */\n\
\n\
  identify : function (userId, traits, options, callback) {\n\
    if (!this.initialized) return;\n\
\n\
    // Allow for optional arguments.\n\
    if (type(options) === 'function') {\n\
      callback = options;\n\
      options = undefined;\n\
    }\n\
    if (type(traits) === 'function') {\n\
      callback = traits;\n\
      traits = undefined;\n\
    }\n\
    if (type(userId) === 'object') {\n\
      if (traits && type(traits) === 'function') callback = traits;\n\
      traits = userId;\n\
      userId = undefined;\n\
    }\n\
\n\
    // Use our cookied ID if they didn't provide one.\n\
    if (userId === undefined || user === null) userId = user.id();\n\
\n\
    // Update the cookie with the new userId and traits.\n\
    var alias = user.update(userId, traits);\n\
\n\
    // Clone `traits` before we manipulate it, so we don't do anything uncouth\n\
    // and take the user.traits() so anonymous users carry over traits.\n\
    traits = cleanTraits(userId, clone(user.traits()));\n\
\n\
    // Call `identify` on all of our enabled providers that support it.\n\
    each(this.providers, function (provider) {\n\
      if (provider.identify && isEnabled(provider, options)) {\n\
        var args = [userId, clone(traits), clone(options)];\n\
        if (provider.ready) {\n\
          provider.identify.apply(provider, args);\n\
        } else {\n\
          provider.enqueue('identify', args);\n\
        }\n\
      }\n\
    });\n\
\n\
    // If we should alias, go ahead and do it.\n\
    // if (alias) this.alias(userId);\n\
\n\
    if (callback && type(callback) === 'function') {\n\
      setTimeout(callback, this.timeout);\n\
    }\n\
  },\n\
\n\
\n\
\n\
  /**\n\
   * Group\n\
   *\n\
   * Groups multiple users together under one \"account\" or \"team\" or \"company\".\n\
   * Acts on the currently identified user, so you need to call identify before\n\
   * calling group. For example:\n\
   *\n\
   *     analytics.identify('4d3ed089fb60ab534684b7e0', {\n\
   *         name  : 'Achilles',\n\
   *         email : 'achilles@segment.io',\n\
   *         age   : 23\n\
   *     });\n\
   *\n\
   *     analytics.group('5we93je3889fb60a937dk033', {\n\
   *         name              : 'Acme Co.',\n\
   *         numberOfEmployees : 42,\n\
   *         location          : 'San Francisco'\n\
   *     });\n\
   *\n\
   * @param {String} groupId - The ID you recognize the group by.\n\
   *\n\
   * @param {Object} properties (optional) - A dictionary of properties you know\n\
   * about the group. Things like `numberOfEmployees`, `location`, etc.\n\
   *\n\
   * @param {Object} options (optional) - Settings for the group call.\n\
   *\n\
   * @param {Function} callback (optional) - A function to call after a small\n\
   * timeout, giving the group call time to make requests.\n\
   */\n\
\n\
  group : function (groupId, properties, options, callback) {\n\
    if (!this.initialized) return;\n\
\n\
    // Allow for optional arguments.\n\
    if (type(options) === 'function') {\n\
      callback = options;\n\
      options = undefined;\n\
    }\n\
    if (type(properties) === 'function') {\n\
      callback = properties;\n\
      properties = undefined;\n\
    }\n\
\n\
    // Clone `properties` before we manipulate it, so we don't do anything bad,\n\
    // and back it by an empty object so that providers can assume it exists.\n\
    properties = clone(properties) || {};\n\
\n\
    // Convert dates from more types of input into Date objects.\n\
    if (properties.created) properties.created = newDate(properties.created);\n\
\n\
    // Call `group` on all of our enabled providers that support it.\n\
    each(this.providers, function (provider) {\n\
      if (provider.group && isEnabled(provider, options)) {\n\
        var args = [groupId, clone(properties), clone(options)];\n\
        if (provider.ready) {\n\
          provider.group.apply(provider, args);\n\
        } else {\n\
          provider.enqueue('group', args);\n\
        }\n\
      }\n\
    });\n\
\n\
    // If we have a callback, call it after a small timeout.\n\
    if (callback && type(callback) === 'function') {\n\
      setTimeout(callback, this.timeout);\n\
    }\n\
  },\n\
\n\
\n\
  /**\n\
   * Track\n\
   *\n\
   * Record an event (or action) that your user has triggered. For example:\n\
   *\n\
   *     analytics.track('Added a Friend', {\n\
   *         level  : 'hard',\n\
   *         volume : 11\n\
   *     });\n\
   *\n\
   * @param {String} event - The name of your event.\n\
   *\n\
   * @param {Object} properties (optional) - A dictionary of properties of the\n\
   * event. `properties` are all camelCase (we'll automatically conver them to\n\
   * the proper case each provider needs).\n\
   *\n\
   * @param {Object} options (optional) - Settings for the track call.\n\
   *\n\
   * @param {Function} callback - A function to call after a small\n\
   * timeout, giving the identify time to make requests.\n\
   */\n\
\n\
  track : function (event, properties, options, callback) {\n\
    if (!this.initialized) return;\n\
\n\
    // Allow for optional arguments.\n\
    if (type(options) === 'function') {\n\
      callback = options;\n\
      options = undefined;\n\
    }\n\
    if (type(properties) === 'function') {\n\
      callback = properties;\n\
      properties = undefined;\n\
    }\n\
\n\
    properties = clone(properties) || {};\n\
\n\
    // Call `track` on all of our enabled providers that support it.\n\
    each(this.providers, function (provider) {\n\
      if (provider.track && isEnabled(provider, options)) {\n\
        var args = [event, clone(properties), clone(options)];\n\
        if (provider.ready) {\n\
          provider.track.apply(provider, args);\n\
        } else {\n\
          provider.enqueue('track', args);\n\
        }\n\
      }\n\
    });\n\
\n\
    if (callback && type(callback) === 'function') {\n\
      setTimeout(callback, this.timeout);\n\
    }\n\
  },\n\
\n\
\n\
  /**\n\
   * Track Link\n\
   *\n\
   * A helper for tracking outbound links that would normally navigate away from\n\
   * the page before the track requests were made. It works by wrapping the\n\
   * calls in a short timeout, giving the requests time to fire.\n\
   *\n\
   * @param {Element|Array} links - The link element or array of link elements\n\
   * to bind to. (Allowing arrays makes it easy to pass in jQuery objects.)\n\
   *\n\
   * @param {String|Function} event - Passed directly to `track`. Or in the case\n\
   * that it's a function, it will be called with the link element as the first\n\
   * argument.\n\
   *\n\
   * @param {Object|Function} properties (optional) - Passed directly to\n\
   * `track`. Or in the case that it's a function, it will be called with the\n\
   * link element as the first argument.\n\
   */\n\
\n\
  trackLink : function (links, event, properties) {\n\
    if (!links) return;\n\
\n\
    // Turn a single link into an array so that we're always handling\n\
    // arrays, which allows for passing jQuery objects.\n\
    if ('element' === type(links)) links = [links];\n\
\n\
    var self               = this\n\
      , eventFunction      = 'function' === type(event)\n\
      , propertiesFunction = 'function' === type(properties);\n\
\n\
    each(links, function (el) {\n\
      bind(el, 'click', function (e) {\n\
\n\
        // Allow for `event` or `properties` to be a function. And pass it the\n\
        // link element that was clicked.\n\
        var newEvent      = eventFunction ? event(el) : event;\n\
        var newProperties = propertiesFunction ? properties(el) : properties;\n\
\n\
        self.track(newEvent, newProperties);\n\
\n\
        // To justify us preventing the default behavior we must:\n\
        //\n\
        // * Have an `href` to use.\n\
        // * Not have a `target=\"_blank\"` attribute.\n\
        // * Not have any special keys pressed, because they might be trying to\n\
        //   open in a new tab, or window, or download.\n\
        //\n\
        // This might not cover all cases, but we'd rather throw out an event\n\
        // than miss a case that breaks the user experience.\n\
        if (el.href && el.target !== '_blank' && !isMeta(e)) {\n\
\n\
          preventDefault(e);\n\
\n\
          // Navigate to the url after just enough of a timeout.\n\
          setTimeout(function () {\n\
            window.location.href = el.href;\n\
          }, self.timeout);\n\
        }\n\
      });\n\
    });\n\
  },\n\
\n\
\n\
  /**\n\
   * Track Form\n\
   *\n\
   * Similar to `trackClick`, this is a helper for tracking form submissions\n\
   * that would normally navigate away from the page before a track request can\n\
   * be sent. It works by preventing the default submit event, sending our\n\
   * track requests, and then submitting the form programmatically.\n\
   *\n\
   * @param {Element|Array} forms - The form element or array of form elements\n\
   * to bind to. (Allowing arrays makes it easy to pass in jQuery objects.)\n\
   *\n\
   * @param {String|Function} event - Passed directly to `track`. Or in the case\n\
   * that it's a function, it will be called with the form element as the first\n\
   * argument.\n\
   *\n\
   * @param {Object|Function} properties (optional) - Passed directly to\n\
   * `track`. Or in the case that it's a function, it will be called with the\n\
   * form element as the first argument.\n\
   */\n\
\n\
  trackForm : function (form, event, properties) {\n\
    if (!form) return;\n\
\n\
    // Turn a single element into an array so that we're always handling arrays,\n\
    // which allows for passing jQuery objects.\n\
    if ('element' === type(form)) form = [form];\n\
\n\
    var self               = this\n\
      , eventFunction      = 'function' === type(event)\n\
      , propertiesFunction = 'function' === type(properties);\n\
\n\
    each(form, function (el) {\n\
      var handler = function (e) {\n\
\n\
        // Allow for `event` or `properties` to be a function. And pass it the\n\
        // form element that was submitted.\n\
        var newEvent      = eventFunction ? event(el) : event;\n\
        var newProperties = propertiesFunction ? properties(el) : properties;\n\
\n\
        self.track(newEvent, newProperties);\n\
\n\
        preventDefault(e);\n\
\n\
        // Submit the form after a timeout, giving the event time to fire.\n\
        setTimeout(function () {\n\
          el.submit();\n\
        }, self.timeout);\n\
      };\n\
\n\
      // Support the form being submitted via jQuery instead of for real. This\n\
      // doesn't happen automatically because `el.submit()` doesn't actually\n\
      // fire submit handlers, which is what jQuery uses internally. >_<\n\
      var dom = window.jQuery || window.Zepto;\n\
      if (dom) {\n\
        dom(el).submit(handler);\n\
      } else {\n\
        bind(el, 'submit', handler);\n\
      }\n\
    });\n\
  },\n\
\n\
\n\
  /**\n\
   * Pageview\n\
   *\n\
   * Simulate a pageview in single-page applications, where real pageviews don't\n\
   * occur. This isn't support by all providers.\n\
   *\n\
   * @param {String} url (optional) - The path of the page (eg. '/login'). Most\n\
   * providers will default to the current pages URL, so you don't need this.\n\
   *\n\
   * @param {Object} options (optional) - Settings for the pageview call.\n\
   *\n\
   */\n\
\n\
  pageview : function (url,options) {\n\
    if (!this.initialized) return;\n\
\n\
    // Call `pageview` on all of our enabled providers that support it.\n\
    each(this.providers, function (provider) {\n\
      if (provider.pageview && isEnabled(provider, options)) {\n\
        var args = [url];\n\
        if (provider.ready) {\n\
          provider.pageview.apply(provider, args);\n\
        } else {\n\
          provider.enqueue('pageview', args);\n\
        }\n\
      }\n\
    });\n\
  },\n\
\n\
\n\
  /**\n\
   * Alias\n\
   *\n\
   * Merges two previously unassociate user identities. This comes in handy if\n\
   * the same user visits from two different devices and you want to combine\n\
   * their analytics history.\n\
   *\n\
   * Some providers don't support merging users.\n\
   *\n\
   * @param {String} newId - The new ID you want to recognize the user by.\n\
   *\n\
   * @param {String} originalId (optional) - The original ID that the user was\n\
   * recognized by. This defaults to the current identified user's ID if there\n\
   * is one. In most cases you don't need to pass in the `originalId`.\n\
   */\n\
\n\
  alias : function (newId, originalId, options) {\n\
    if (!this.initialized) return;\n\
\n\
    if (type(originalId) === 'object') {\n\
      options    = originalId;\n\
      originalId = undefined;\n\
    }\n\
\n\
    // Call `alias` on all of our enabled providers that support it.\n\
    each(this.providers, function (provider) {\n\
      if (provider.alias && isEnabled(provider, options)) {\n\
        var args = [newId, originalId];\n\
        if (provider.ready) {\n\
          provider.alias.apply(provider, args);\n\
        } else {\n\
          provider.enqueue('alias', args);\n\
        }\n\
      }\n\
    });\n\
  },\n\
\n\
\n\
  /**\n\
   * Log\n\
   *\n\
   * Log an error to analytics providers that support it, like Sentry.\n\
   *\n\
   * @param {Error|String} error - The error or string to log.\n\
   * @param {Object} properties - Properties about the error.\n\
   * @param {Object} options (optional) - Settings for the log call.\n\
   */\n\
\n\
  log : function (error, properties, options) {\n\
    if (!this.initialized) return;\n\
\n\
    each(this.providers, function (provider) {\n\
      if (provider.log && isEnabled(provider, options)) {\n\
        var args = [error, properties, options];\n\
        if (provider.ready) {\n\
          provider.log.apply(provider, args);\n\
        } else {\n\
          provider.enqueue('log', args);\n\
        }\n\
      }\n\
    });\n\
  }\n\
\n\
});\n\
\n\
\n\
/**\n\
 * Backwards compatibility.\n\
 */\n\
\n\
// Alias `trackClick` and `trackSubmit`.\n\
Analytics.prototype.trackClick = Analytics.prototype.trackLink;\n\
Analytics.prototype.trackSubmit = Analytics.prototype.trackForm;\n\
\n\
\n\
/**\n\
 * Determine whether a provider is enabled or not based on the options object.\n\
 *\n\
 * @param {Object} provider - the current provider.\n\
 * @param {Object} options - the current call's options.\n\
 *\n\
 * @return {Boolean} - wether the provider is enabled.\n\
 */\n\
\n\
var isEnabled = function (provider, options) {\n\
  var enabled = true;\n\
  if (!options || !options.providers) return enabled;\n\
\n\
  // Default to the 'all' or 'All' setting.\n\
  var map = options.providers;\n\
  if (map.all !== undefined) enabled = map.all;\n\
  if (map.All !== undefined) enabled = map.All;\n\
\n\
  // Look for this provider's specific setting.\n\
  var name = provider.name;\n\
  if (map[name] !== undefined) enabled = map[name];\n\
\n\
  return enabled;\n\
};\n\
\n\
\n\
/**\n\
 * Clean up traits, default some useful things both so the user doesn't have to\n\
 * and so we don't have to do it on a provider-basis.\n\
 *\n\
 * @param {Object}  traits  The traits object.\n\
 * @return {Object}         The new traits object.\n\
 */\n\
\n\
var cleanTraits = function (userId, traits) {\n\
\n\
  // Add the `email` trait if it doesn't exist and the `userId` is an email.\n\
  if (!traits.email && isEmail(userId)) traits.email = userId;\n\
\n\
  // Create the `name` trait if it doesn't exist and `firstName` and `lastName`\n\
  // are both supplied.\n\
  if (!traits.name && traits.firstName && traits.lastName) {\n\
    traits.name = traits.firstName + ' ' + traits.lastName;\n\
  }\n\
\n\
  // Convert dates from more types of input into Date objects.\n\
  if (traits.created) traits.created = newDate(traits.created);\n\
  if (traits.company && traits.company.created) {\n\
    traits.company.created = newDate(traits.company.created);\n\
  }\n\
\n\
  return traits;\n\
};\n\
//@ sourceURL=analytics/src/analytics.js"
));
require.register("analytics/src/cookie.js", Function("exports, require, module",
"\n\
var bindAll   = require('bind-all')\n\
  , cookie    = require('cookie')\n\
  , clone     = require('clone')\n\
  , defaults  = require('defaults')\n\
  , json      = require('json')\n\
  , topDomain = require('top-domain');\n\
\n\
\n\
function Cookie (options) {\n\
  this.options(options);\n\
}\n\
\n\
/**\n\
 * Get or set the cookie options\n\
 *\n\
 * @param  {Object} options\n\
 *   @field {Number}  maxage (1 year)\n\
 *   @field {String}  domain\n\
 *   @field {String}  path\n\
 *   @field {Boolean} secure\n\
 */\n\
\n\
Cookie.prototype.options = function (options) {\n\
  if (arguments.length === 0) return this._options;\n\
\n\
  options || (options = {});\n\
\n\
  var domain = '.' + topDomain(window.location.href);\n\
\n\
  // localhost cookies are special: http://curl.haxx.se/rfc/cookie_spec.html\n\
  if (domain === '.localhost') domain = '';\n\
\n\
  defaults(options, {\n\
    maxage  : 31536000000, // default to a year\n\
    path    : '/',\n\
    domain  : domain\n\
  });\n\
\n\
  this._options = options;\n\
};\n\
\n\
\n\
/**\n\
 * Set a value in our cookie\n\
 *\n\
 * @param  {String} key\n\
 * @param  {Object} value\n\
 * @return {Boolean} saved\n\
 */\n\
\n\
Cookie.prototype.set = function (key, value) {\n\
  try {\n\
    value = json.stringify(value);\n\
    cookie(key, value, clone(this._options));\n\
    return true;\n\
  } catch (e) {\n\
    return false;\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Get a value from our cookie\n\
 * @param  {String} key\n\
 * @return {Object} value\n\
 */\n\
\n\
Cookie.prototype.get = function (key) {\n\
  try {\n\
    var value = cookie(key);\n\
    value = value ? json.parse(value) : null;\n\
    return value;\n\
  } catch (e) {\n\
    return null;\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Remove a value from the cookie\n\
 *\n\
 * @param  {String}  key\n\
 * @return {Boolean} removed\n\
 */\n\
\n\
Cookie.prototype.remove = function (key) {\n\
  try {\n\
    cookie(key, null, clone(this._options));\n\
    return true;\n\
  } catch (e) {\n\
    return false;\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Export singleton cookie\n\
 */\n\
\n\
module.exports = bindAll(new Cookie());\n\
\n\
\n\
module.exports.Cookie = Cookie;\n\
//@ sourceURL=analytics/src/cookie.js"
));
require.register("analytics/src/localStore.js", Function("exports, require, module",
"\n\
var bindAll  = require('bind-all')\n\
  , defaults = require('defaults')\n\
  , store    = require('store');\n\
\n\
\n\
function Store (options) {\n\
  this.options(options);\n\
}\n\
\n\
\n\
/**\n\
 * Sets the options for the store\n\
 *\n\
 * @param  {Object} options\n\
 *   @field {Boolean} enabled (true)\n\
 */\n\
\n\
Store.prototype.options = function (options) {\n\
  if (arguments.length === 0) return this._options;\n\
\n\
  options || (options = {});\n\
  defaults(options, { enabled : true });\n\
\n\
  this.enabled  = options.enabled && store.enabled;\n\
  this._options = options;\n\
};\n\
\n\
\n\
/**\n\
 * Sets a value in local storage\n\
 *\n\
 * @param  {String} key\n\
 * @param  {Object} value\n\
 */\n\
\n\
Store.prototype.set = function (key, value) {\n\
  if (!this.enabled) return false;\n\
  return store.set(key, value);\n\
};\n\
\n\
\n\
/**\n\
 * Gets a value from local storage\n\
 *\n\
 * @param  {String} key\n\
 * @return {Object}\n\
 */\n\
\n\
Store.prototype.get = function (key) {\n\
  if (!this.enabled) return null;\n\
  return store.get(key);\n\
};\n\
\n\
\n\
/**\n\
 * Removes a value from local storage\n\
 *\n\
 * @param  {String} key\n\
 */\n\
\n\
Store.prototype.remove = function (key) {\n\
  if (!this.enabled) return false;\n\
  return store.remove(key);\n\
};\n\
\n\
\n\
/**\n\
 * Singleton exports\n\
 */\n\
\n\
module.exports = bindAll(new Store());//@ sourceURL=analytics/src/localStore.js"
));
require.register("analytics/src/provider.js", Function("exports, require, module",
"var each   = require('each')\n\
  , extend = require('extend')\n\
  , type   = require('type');\n\
\n\
\n\
module.exports = Provider;\n\
\n\
\n\
/**\n\
 * Provider\n\
 *\n\
 * @param {Object} options - settings to initialize the Provider with. This will\n\
 * be merged with the Provider's own defaults.\n\
 *\n\
 * @param {Function} ready - a ready callback, to be called when the provider is\n\
 * ready to handle analytics calls.\n\
 */\n\
\n\
function Provider (options, ready, analytics) {\n\
  var self = this;\n\
\n\
  // Store the reference to the global `analytics` object.\n\
  this.analytics = analytics;\n\
\n\
  // Make a queue of `{ method : 'identify', args : [] }` to unload once ready.\n\
  this.queue = [];\n\
  this.ready = false;\n\
\n\
  // Allow for `options` to only be a string if the provider has specified\n\
  // a default `key`, in which case convert `options` into a dictionary. Also\n\
  // allow for it to be `true`, like in Optimizely's case where there is no need\n\
  // for any default key.\n\
  if (type(options) !== 'object') {\n\
    if (options === true) {\n\
      options = {};\n\
    } else if (this.key) {\n\
      var key = options;\n\
      options = {};\n\
      options[this.key] = key;\n\
    } else {\n\
      throw new Error('Couldnt resolve options.');\n\
    }\n\
  }\n\
\n\
  // Extend the passed-in options with our defaults.\n\
  this.options = extend({}, this.defaults, options);\n\
\n\
  // Wrap our ready function, so that it ready from our internal queue first\n\
  // and then marks us as ready.\n\
  var dequeue = function () {\n\
    each(self.queue, function (call) {\n\
      var method = call.method\n\
        , args   = call.args;\n\
      self[method].apply(self, args);\n\
    });\n\
    self.ready = true;\n\
    self.queue = [];\n\
    ready();\n\
  };\n\
\n\
  // Call our initialize method.\n\
  this.initialize.call(this, this.options, dequeue);\n\
}\n\
\n\
\n\
/**\n\
 * Inheritance helper.\n\
 *\n\
 * Modeled after Backbone's `extend` method:\n\
 * https://github.com/documentcloud/backbone/blob/master/backbone.js#L1464\n\
 */\n\
\n\
Provider.extend = function (properties) {\n\
  var parent = this;\n\
  var child = function () { return parent.apply(this, arguments); };\n\
  var Surrogate = function () { this.constructor = child; };\n\
  Surrogate.prototype = parent.prototype;\n\
  child.prototype = new Surrogate();\n\
  extend(child.prototype, properties);\n\
  return child;\n\
};\n\
\n\
\n\
/**\n\
 * Augment Provider's prototype.\n\
 */\n\
\n\
extend(Provider.prototype, {\n\
\n\
  /**\n\
   * Default settings for the provider.\n\
   */\n\
\n\
  options : {},\n\
\n\
\n\
  /**\n\
   * The single required API key for the provider. This lets us support a terse\n\
   * initialization syntax:\n\
   *\n\
   *     analytics.initialize({\n\
   *       'Provider' : 'XXXXXXX'\n\
   *     });\n\
   *\n\
   * Only add this if the provider has a _single_ required key.\n\
   */\n\
\n\
  key : undefined,\n\
\n\
\n\
  /**\n\
   * Initialize our provider.\n\
   *\n\
   * @param {Object} options - the settings for the provider.\n\
   * @param {Function} ready - a ready callback to call when we're ready to\n\
   * start accept analytics method calls.\n\
   */\n\
  initialize : function (options, ready) {\n\
    ready();\n\
  },\n\
\n\
\n\
  /**\n\
   * Adds an item to the our internal pre-ready queue.\n\
   *\n\
   * @param {String} method - the analytics method to call (eg. 'track').\n\
   * @param {Object} args - the arguments to pass to the method.\n\
   */\n\
  enqueue : function (method, args) {\n\
    this.queue.push({\n\
      method : method,\n\
      args : args\n\
    });\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/provider.js"
));
require.register("analytics/src/user.js", Function("exports, require, module",
"var bindAll    = require('bind-all')\n\
  , clone      = require('clone')\n\
  , cookie     = require('./cookie')\n\
  , defaults   = require('defaults')\n\
  , extend     = require('extend')\n\
  , localStore = require('./localStore');\n\
\n\
\n\
function User (options) {\n\
  this._id     = null;\n\
  this._traits = {};\n\
  this.options(options);\n\
}\n\
\n\
\n\
/**\n\
 * Sets the options for the user\n\
 *\n\
 * @param  {Object} options\n\
 *   @field {Object}  cookie\n\
 *   @field {Object}  localStorage\n\
 *   @field {Boolean} persist (true)\n\
 */\n\
\n\
User.prototype.options = function (options) {\n\
  options || (options = {});\n\
\n\
  defaults(options, {\n\
    persist : true\n\
  });\n\
\n\
  this.cookie(options.cookie);\n\
  this.localStorage(options.localStorage);\n\
  this.persist = options.persist;\n\
};\n\
\n\
\n\
/**\n\
 * Get or set cookie options\n\
 *\n\
 * @param  {Object} options\n\
 */\n\
\n\
User.prototype.cookie = function (options) {\n\
  if (arguments.length === 0) return this.cookieOptions;\n\
\n\
  options || (options = {});\n\
  defaults(options, {\n\
    key    : 'ajs_user_id',\n\
    oldKey : 'ajs_user'\n\
  });\n\
  this.cookieOptions = options;\n\
};\n\
\n\
\n\
/**\n\
 * Get or set local storage options\n\
 *\n\
 * @param  {Object} options\n\
 */\n\
\n\
User.prototype.localStorage = function (options) {\n\
  if (arguments.length === 0) return this.localStorageOptions;\n\
\n\
  options || (options = {});\n\
  defaults(options, {\n\
    key    : 'ajs_user_traits'\n\
  });\n\
  this.localStorageOptions = options;\n\
};\n\
\n\
\n\
/**\n\
 * Get or set the user id\n\
 *\n\
 * @param  {String} id\n\
 */\n\
\n\
User.prototype.id = function (id) {\n\
  if (arguments.length === 0) return this._id;\n\
  this._id = id;\n\
};\n\
\n\
\n\
/**\n\
 * Get or set the user traits\n\
 *\n\
 * @param  {Object} traits\n\
 */\n\
\n\
User.prototype.traits = function (traits) {\n\
  if (arguments.length === 0) return clone(this._traits);\n\
  traits || (traits = {});\n\
\n\
  this._traits = traits;\n\
};\n\
\n\
\n\
/**\n\
 * Updates the current stored user with id and traits.\n\
 *\n\
 * @param {String} userId - the new user ID.\n\
 * @param {Object} traits - any new traits.\n\
 * @return {Boolean} whether alias should be called.\n\
 */\n\
\n\
User.prototype.update = function (userId, traits) {\n\
\n\
  // Make an alias call if there was no previous userId, there is one\n\
  // now, and we are using a cookie between page loads.\n\
  var alias = !this.id() && userId && this.persist;\n\
\n\
  traits || (traits = {});\n\
\n\
  // If there is a current user and the new user isn't the same,\n\
  // we want to just replace their traits. Otherwise extend.\n\
  if (this.id() && userId && this.id() !== userId) this.traits(traits);\n\
  else this.traits(extend(this.traits(), traits));\n\
\n\
  if (userId) this.id(userId);\n\
\n\
  this.save();\n\
\n\
  return alias;\n\
};\n\
\n\
\n\
/**\n\
 * Save the user to localstorage and cookie\n\
 *\n\
 * @return {Boolean} saved\n\
 */\n\
\n\
User.prototype.save = function () {\n\
  if (!this.persist) return false;\n\
\n\
  cookie.set(this.cookie().key, this.id());\n\
  localStore.set(this.localStorage().key, this.traits());\n\
  return true;\n\
};\n\
\n\
\n\
/**\n\
 * Loads a saved user, and set its information\n\
 *\n\
 * @return {Object} user\n\
 */\n\
\n\
User.prototype.load = function () {\n\
  if (this.loadOldCookie()) return this.toJSON();\n\
\n\
  var id     = cookie.get(this.cookie().key)\n\
    , traits = localStore.get(this.localStorage().key);\n\
\n\
  this.id(id);\n\
  this.traits(traits);\n\
  return this.toJSON();\n\
};\n\
\n\
\n\
/**\n\
 * Clears the user, and removes the stored version\n\
 *\n\
 */\n\
\n\
User.prototype.clear = function () {\n\
  cookie.remove(this.cookie().key);\n\
  localStore.remove(this.localStorage().key);\n\
  this.id(null);\n\
  this.traits({});\n\
};\n\
\n\
\n\
/**\n\
 * Load the old user from the cookie. Should be phased\n\
 * out at some point\n\
 *\n\
 * @return {Boolean} loaded\n\
 */\n\
\n\
User.prototype.loadOldCookie = function () {\n\
  var user = cookie.get(this.cookie().oldKey);\n\
  if (!user) return false;\n\
\n\
  this.id(user.id);\n\
  this.traits(user.traits);\n\
  cookie.remove(this.cookie().oldKey);\n\
  return true;\n\
};\n\
\n\
\n\
/**\n\
 * Get the user info\n\
 *\n\
 * @return {Object}\n\
 */\n\
\n\
User.prototype.toJSON = function () {\n\
  return {\n\
    id     : this.id(),\n\
    traits : this.traits()\n\
  };\n\
};\n\
\n\
\n\
/**\n\
 * Export the new user as a singleton.\n\
 */\n\
\n\
module.exports = bindAll(new User());\n\
//@ sourceURL=analytics/src/user.js"
));
require.register("analytics/src/utils.js", Function("exports, require, module",
"// A helper to track events based on the 'anjs' url parameter\n\
exports.getUrlParameter = function (urlSearchParameter, paramKey) {\n\
  var params = urlSearchParameter.replace('?', '').split('&');\n\
  for (var i = 0; i < params.length; i += 1) {\n\
    var param = params[i].split('=');\n\
    if (param.length === 2 && param[0] === paramKey) {\n\
      return decodeURIComponent(param[1]);\n\
    }\n\
  }\n\
};//@ sourceURL=analytics/src/utils.js"
));
require.register("analytics/src/providers/adroll.js", Function("exports, require, module",
"// https://www.adroll.com/dashboard\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'AdRoll',\n\
\n\
  defaults : {\n\
    // Adroll requires two options: `advId` and `pixId`.\n\
    advId : null,\n\
    pixId : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window.adroll_adv_id = options.advId;\n\
    window.adroll_pix_id = options.pixId;\n\
    window.__adroll_loaded = true;\n\
\n\
    load({\n\
      http  : 'http://a.adroll.com/j/roundtrip.js',\n\
      https : 'https://s.adroll.com/j/roundtrip.js'\n\
    }, ready);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/adroll.js"
));
require.register("analytics/src/providers/amplitude.js", Function("exports, require, module",
"// https://github.com/amplitude/Amplitude-Javascript\n\
\n\
var Provider = require('../provider')\n\
  , alias    = require('alias')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Amplitude',\n\
\n\
  key : 'apiKey',\n\
\n\
  defaults : {\n\
    // Amplitude's required API key.\n\
    apiKey : null,\n\
    // Whether to track pageviews to Amplitude.\n\
    pageview : false\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    // Create the Amplitude global and queuer methods.\n\
    (function(e,t){var r=e.amplitude||{};\n\
    r._q=[];function i(e){r[e]=function(){r._q.push([e].concat(Array.prototype.slice.call(arguments,0)))}}\n\
    var s=[\"init\",\"logEvent\",\"setUserId\",\"setGlobalUserProperties\",\"setVersionName\"];\n\
    for(var c=0;c<s.length;c++){i(s[c])}e.amplitude=r})(window,document);\n\
\n\
    // Load the Amplitude script and initialize with the API key.\n\
    load('https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-1.0-min.js');\n\
    window.amplitude.init(options.apiKey);\n\
\n\
    // Amplitude creates a queue, so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    if (userId) window.amplitude.setUserId(userId);\n\
    if (traits) window.amplitude.setGlobalUserProperties(traits);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    window.amplitude.logEvent(event, properties);\n\
  },\n\
\n\
  pageview : function (url) {\n\
    if (!this.options.pageview) return;\n\
\n\
    var properties = {\n\
      url  : url || document.location.href,\n\
      name : document.title\n\
    };\n\
\n\
    this.track('Loaded a Page', properties);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/amplitude.js"
));
require.register("analytics/src/providers/bugherd.js", Function("exports, require, module",
"// http://support.bugherd.com/home\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'BugHerd',\n\
\n\
  key : 'apiKey',\n\
\n\
  defaults : {\n\
    apiKey : null,\n\
    // Optionally hide the feedback tab if you want to build your own.\n\
    // http://support.bugherd.com/entries/21497629-Create-your-own-Send-Feedback-tab\n\
    showFeedbackTab : true\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    if (!options.showFeedbackTab) {\n\
        window.BugHerdConfig = { \"feedback\" : { \"hide\" : true } };\n\
    }\n\
    load('//www.bugherd.com/sidebarv2.js?apikey=' + options.apiKey, ready);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/bugherd.js"
));
require.register("analytics/src/providers/chartbeat.js", Function("exports, require, module",
"// http://chartbeat.com/docs/adding_the_code/\n\
// http://chartbeat.com/docs/configuration_variables/\n\
// http://chartbeat.com/docs/handling_virtual_page_changes/\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Chartbeat',\n\
\n\
  defaults : {\n\
    // Chartbeat requires two options: `domain` and `uid`. All other\n\
    // configuration options are passed straight in!\n\
    domain : null,\n\
    uid    : null\n\
  },\n\
\n\
\n\
  initialize : function (options, ready) {\n\
    // Since all the custom options just get passed through, update the\n\
    // Chartbeat `_sf_async_config` variable with options.\n\
    window._sf_async_config = options;\n\
\n\
    // Chartbeat's javascript should only load after the body\n\
    // is available, see https://github.com/segmentio/analytics.js/issues/107\n\
    var loadChartbeat = function () {\n\
      // We loop until the body is available.\n\
      if (!document.body) return setTimeout(loadChartbeat, 5);\n\
\n\
      // Use the stored date from when chartbeat was loaded.\n\
      window._sf_endpt = (new Date()).getTime();\n\
\n\
      // Load the Chartbeat javascript.\n\
      load({\n\
        https : 'https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/js/chartbeat.js',\n\
        http  : 'http://static.chartbeat.com/js/chartbeat.js'\n\
      }, ready);\n\
    };\n\
    loadChartbeat();\n\
  },\n\
\n\
\n\
  pageview : function (url) {\n\
    // In case the Chartbeat library hasn't loaded yet.\n\
    if (!window.pSUPERFLY) return;\n\
\n\
    // Requires a path, so default to the current one.\n\
    window.pSUPERFLY.virtualPage(url || window.location.pathname);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/chartbeat.js"
));
require.register("analytics/src/providers/clicktale.js", Function("exports, require, module",
"// http://wiki.clicktale.com/Article/JavaScript_API\n\
\n\
var date     = require('load-date')\n\
  , Provider = require('../provider')\n\
  , load     = require('load-script')\n\
  , onBody   = require('on-body');\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'ClickTale',\n\
\n\
  key : 'projectId',\n\
\n\
  defaults : {\n\
\n\
    // If you sign up for a free account, this is the default http (non-ssl) CDN URL\n\
    // that you get. If you sign up for a premium account, you get a different\n\
    // custom CDN URL, so we have to leave it as an option.\n\
    httpCdnUrl     : 'http://s.clicktale.net/WRe0.js',\n\
\n\
    // SSL support is only for premium accounts. Each premium account seems to have\n\
    // a different custom secure CDN URL, so we have to leave it as an option.\n\
    httpsCdnUrl    : null,\n\
\n\
    // The Project ID is loaded in after the ClickTale CDN javascript has loaded.\n\
    projectId      : null,\n\
\n\
    // The recording ratio specifies what fraction of people to screen-record.\n\
    // ClickTale has a special calculator in their setup flow that tells you\n\
    // what number to set for this.\n\
    recordingRatio : 0.01,\n\
\n\
    // The Partition ID determines where ClickTale stores the data according to\n\
    // http://wiki.clicktale.com/Article/JavaScript_API\n\
    partitionId    : null\n\
  },\n\
\n\
\n\
  initialize : function (options, ready) {\n\
    // If we're on https:// but don't have a secure library, return early.\n\
    if (document.location.protocol === 'https:' && !options.httpsCdnUrl) return;\n\
\n\
    // ClickTale wants this at the \"top\" of the page. The analytics.js snippet\n\
    // sets this date synchronously now, and makes it available via load-date.\n\
    window.WRInitTime = date.getTime();\n\
\n\
    // Add the required ClickTale div to the body.\n\
    onBody(function (body) {\n\
      var div = document.createElement('div');\n\
      div.setAttribute('id', 'ClickTaleDiv');\n\
      div.setAttribute('style', 'display: none;');\n\
      body.appendChild(div);\n\
    });\n\
\n\
    var onloaded = function () {\n\
      window.ClickTale(\n\
        options.projectId,\n\
        options.recordingRatio,\n\
        options.partitionId\n\
      );\n\
      ready();\n\
    };\n\
\n\
    // If no SSL library is provided and we're on SSL then we can't load\n\
    // anything (always true for non-premium accounts).\n\
    load({\n\
      http  : options.httpCdnUrl,\n\
      https : options.httpsCdnUrl\n\
    }, onloaded);\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    // We set the userId as the ClickTale UID.\n\
    if (window.ClickTaleSetUID) window.ClickTaleSetUID(userId);\n\
\n\
    // We iterate over all the traits and set them as key-value field pairs.\n\
    if (window.ClickTaleField) {\n\
      for (var traitKey in traits) {\n\
        window.ClickTaleField(traitKey, traits[traitKey]);\n\
      }\n\
    }\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    // ClickTaleEvent is an alias for ClickTaleTag\n\
    if (window.ClickTaleEvent) window.ClickTaleEvent(event);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/clicktale.js"
));
require.register("analytics/src/providers/clicky.js", Function("exports, require, module",
"// http://clicky.com/help/customization/manual?new-domain\n\
// http://clicky.com/help/customization/manual?new-domain#/help/customization#session\n\
\n\
var Provider = require('../provider')\n\
  , user     = require('../user')\n\
  , extend   = require('extend')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Clicky',\n\
\n\
  key : 'siteId',\n\
\n\
  defaults : {\n\
    siteId : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window.clicky_site_ids = window.clicky_site_ids || [];\n\
    window.clicky_site_ids.push(options.siteId);\n\
\n\
    var userId  = user.id()\n\
      , traits  = user.traits()\n\
      , session = {};\n\
\n\
    if (userId) session.id = userId;\n\
    extend(session, traits);\n\
\n\
    window.clicky_custom = { session : session };\n\
\n\
    load('//static.getclicky.com/js', ready);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    window.clicky.log(window.location.href, event);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/clicky.js"
));
require.register("analytics/src/providers/comscore.js", Function("exports, require, module",
"// http://direct.comscore.com/clients/help/FAQ.aspx#faqTagging\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'comScore',\n\
\n\
  key : 'c2',\n\
\n\
  defaults : {\n\
    c1 : '2',\n\
    c2 : null\n\
  },\n\
\n\
  // Pass the entire options object directly into comScore.\n\
  initialize : function (options, ready) {\n\
    window._comscore = window._comscore || [];\n\
    window._comscore.push(options);\n\
    load({\n\
      http  : 'http://b.scorecardresearch.com/beacon.js',\n\
      https : 'https://sb.scorecardresearch.com/beacon.js'\n\
    }, ready);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/comscore.js"
));
require.register("analytics/src/providers/crazyegg.js", Function("exports, require, module",
"var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'CrazyEgg',\n\
\n\
  key : 'accountNumber',\n\
\n\
  defaults : {\n\
    accountNumber : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    var accountPath = options.accountNumber.slice(0,4) + '/' + options.accountNumber.slice(4);\n\
    load('//dnn506yrbagrg.cloudfront.net/pages/scripts/'+accountPath+'.js?'+Math.floor(new Date().getTime()/3600000), ready);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/crazyegg.js"
));
require.register("analytics/src/providers/customerio.js", Function("exports, require, module",
"// http://customer.io/docs/api/javascript.html\n\
\n\
var Provider = require('../provider')\n\
  , isEmail  = require('is-email')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Customer.io',\n\
\n\
  key : 'siteId',\n\
\n\
  defaults : {\n\
    siteId : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    var _cio = window._cio = window._cio || [];\n\
    (function() {\n\
      var a,b,c;\n\
      a = function (f) {\n\
        return function () {\n\
          _cio.push([f].concat(Array.prototype.slice.call(arguments,0)));\n\
        };\n\
      };\n\
      b = ['identify', 'track'];\n\
      for (c = 0; c < b.length; c++) {\n\
        _cio[b[c]] = a(b[c]);\n\
      }\n\
    })();\n\
\n\
    // Load the Customer.io script and add the required `id` and `data-site-id`.\n\
    var script = load('https://assets.customer.io/assets/track.js');\n\
    script.id = 'cio-tracker';\n\
    script.setAttribute('data-site-id', options.siteId);\n\
\n\
    // Since Customer.io creates their required methods in their snippet, we\n\
    // don't need to wait to be ready.\n\
    ready();\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    // Don't do anything if we just have traits, because Customer.io\n\
    // requires a `userId`.\n\
    if (!userId) return;\n\
\n\
    // Customer.io takes the `userId` as part of the traits object.\n\
    traits.id = userId;\n\
\n\
    // Swap the `created` trait to the `created_at` that Customer.io needs\n\
    // and convert it from milliseconds to seconds.\n\
    if (traits.created) {\n\
      traits.created_at = Math.floor(traits.created/1000);\n\
      delete traits.created;\n\
    }\n\
\n\
    window._cio.identify(traits);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    window._cio.track(event, properties);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/customerio.js"
));
require.register("analytics/src/providers/errorception.js", Function("exports, require, module",
"// http://errorception.com/\n\
\n\
var Provider = require('../provider')\n\
  , extend   = require('extend')\n\
  , load     = require('load-script')\n\
  , type     = require('type');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Errorception',\n\
\n\
  key : 'projectId',\n\
\n\
  defaults : {\n\
    projectId : null,\n\
    // Whether to store metadata about the user on `identify` calls, using\n\
    // the [Errorception `meta` API](http://blog.errorception.com/2012/11/capture-custom-data-with-your-errors.html).\n\
    meta : true\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window._errs = window._errs || [options.projectId];\n\
    load('//d15qhc0lu1ghnk.cloudfront.net/beacon.js');\n\
\n\
    // Attach the window `onerror` event.\n\
    var oldOnError = window.onerror;\n\
    window.onerror = function () {\n\
      window._errs.push(arguments);\n\
      // Chain the old onerror handler after we finish our work.\n\
      if ('function' === type(oldOnError)) {\n\
        oldOnError.apply(this, arguments);\n\
      }\n\
    };\n\
\n\
    // Errorception makes a queue, so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  // Add the traits to the Errorception meta object.\n\
  identify : function (userId, traits) {\n\
    if (!this.options.meta) return;\n\
\n\
    // If the custom metadata object hasn't ever been made, make it.\n\
    window._errs.meta || (window._errs.meta = {});\n\
\n\
    // Add `userId` to traits.\n\
    traits.id = userId;\n\
\n\
    // Add all of the traits as metadata.\n\
    extend(window._errs.meta, traits);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/errorception.js"
));
require.register("analytics/src/providers/foxmetrics.js", Function("exports, require, module",
"// http://foxmetrics.com/documentation/apijavascript\r\n\
\r\n\
var Provider = require('../provider')\r\n\
  , load     = require('load-script');\r\n\
\r\n\
\r\n\
module.exports = Provider.extend({\r\n\
\r\n\
  name : 'FoxMetrics',\r\n\
\r\n\
  key : 'appId',\r\n\
\r\n\
  defaults : {\r\n\
    appId : null\r\n\
  },\r\n\
\r\n\
  initialize : function (options, ready) {\r\n\
    var _fxm = window._fxm || {};\r\n\
    window._fxm = _fxm.events || [];\r\n\
    load('//d35tca7vmefkrc.cloudfront.net/scripts/' + options.appId + '.js');\r\n\
\r\n\
    // FoxMetrics makes a queue, so it's ready immediately.\r\n\
    ready();\r\n\
  },\r\n\
\r\n\
  identify : function (userId, traits) {\r\n\
    // A `userId` is required for profile updates.\r\n\
    if (!userId) return;\r\n\
\r\n\
    // FoxMetrics needs the first and last name seperately. Fallback to\r\n\
    // splitting the `name` trait if we don't have what we need.\r\n\
    var firstName = traits.firstName\r\n\
      , lastName  = traits.lastName;\r\n\
\r\n\
    if (!firstName && traits.name) firstName = traits.name.split(' ')[0];\r\n\
    if (!lastName && traits.name)  lastName  = traits.name.split(' ')[1];\r\n\
\r\n\
    window._fxm.push([\r\n\
      '_fxm.visitor.profile',\r\n\
      userId,         // user id\r\n\
      firstName,      // first name\r\n\
      lastName,       // last name\r\n\
      traits.email,   // email\r\n\
      traits.address, // address\r\n\
      undefined,      // social\r\n\
      undefined,      // partners\r\n\
      traits          // attributes\r\n\
    ]);\r\n\
  },\r\n\
\r\n\
  track : function (event, properties) {\r\n\
    window._fxm.push([\r\n\
      event,               // event name\r\n\
      properties.category, // category\r\n\
      properties           // properties\r\n\
    ]);\r\n\
  },\r\n\
\r\n\
  pageview : function (url) {\r\n\
    window._fxm.push([\r\n\
      '_fxm.pages.view',\r\n\
      undefined, // title\r\n\
      undefined, // name\r\n\
      undefined, // category\r\n\
      url,       // url\r\n\
      undefined  // referrer\r\n\
    ]);\r\n\
  }\r\n\
\r\n\
});//@ sourceURL=analytics/src/providers/foxmetrics.js"
));
require.register("analytics/src/providers/gauges.js", Function("exports, require, module",
"// http://get.gaug.es/documentation/tracking/\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Gauges',\n\
\n\
  key : 'siteId',\n\
\n\
  defaults : {\n\
    siteId : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window._gauges = window._gauges || [];\n\
    var script = load('//secure.gaug.es/track.js');\n\
    // Gauges needs a few attributes on its script element.\n\
    script.id = 'gauges-tracker';\n\
    script.setAttribute('data-site-id', options.siteId);\n\
\n\
    // Gauges make a queue so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  pageview : function (url) {\n\
    window._gauges.push(['track']);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/gauges.js"
));
require.register("analytics/src/providers/get-satisfaction.js", Function("exports, require, module",
"// You have to be signed in to access the snippet code:\n\
// https://console.getsatisfaction.com/start/101022?signup=true#engage\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script')\n\
  , onBody   = require('on-body');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Get Satisfaction',\n\
\n\
  key : 'widgetId',\n\
\n\
  defaults : {\n\
    widgetId : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    // Get Satisfaction requires a div that will become their widget tab. Append\n\
    // it once `document.body` exists.\n\
    var div = document.createElement('div');\n\
    var id = div.id = 'getsat-widget-' + options.widgetId;\n\
    onBody(function (body) {\n\
      body.appendChild(div);\n\
    });\n\
\n\
    // Usually they load their snippet synchronously, so we need to wait for it\n\
    // to come back before initializing the tab.\n\
    load('https://loader.engage.gsfn.us/loader.js', function () {\n\
      if (window.GSFN !== undefined) {\n\
        window.GSFN.loadWidget(options.widgetId, { containerId : id });\n\
      }\n\
      ready();\n\
    });\n\
\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/get-satisfaction.js"
));
require.register("analytics/src/providers/google-analytics.js", Function("exports, require, module",
"// https://developers.google.com/analytics/devguides/collection/gajs/\n\
\n\
var Provider  = require('../provider')\n\
  , load      = require('load-script')\n\
  , type      = require('type')\n\
  , url       = require('url')\n\
  , canonical = require('canonical');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Google Analytics',\n\
\n\
  key : 'trackingId',\n\
\n\
  defaults : {\n\
    // Whether to anonymize the IP address collected for the user.\n\
    anonymizeIp : false,\n\
    // An optional domain setting, to restrict where events can originate from.\n\
    domain : null,\n\
    // Whether to enable GOogle's DoubleClick remarketing feature.\n\
    doubleClick : false,\n\
    // Whether to use Google Analytics's Enhanced Link Attribution feature:\n\
    // http://support.google.com/analytics/bin/answer.py?hl=en&answer=2558867\n\
    enhancedLinkAttribution : false,\n\
    // A domain to ignore for referrers. Maps to _addIgnoredRef\n\
    ignoreReferrer : null,\n\
    // Whether or not to track and initial pageview when initialized.\n\
    initialPageview : true,\n\
    // The setting to use for Google Analytics's Site Speed Sample Rate feature:\n\
    // https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate\n\
    siteSpeedSampleRate : null,\n\
    // Your Google Analytics Tracking ID.\n\
    trackingId : null,\n\
    // Whether you're using the new Universal Analytics or not.\n\
    universalClient: false\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    if (options.universalClient) this.initializeUniversal(options, ready);\n\
    else this.initializeClassic(options, ready);\n\
  },\n\
\n\
  initializeClassic: function (options, ready) {\n\
    window._gaq = window._gaq || [];\n\
    window._gaq.push(['_setAccount', options.trackingId]);\n\
\n\
    // Apply a bunch of optional settings.\n\
    if (options.domain) {\n\
      window._gaq.push(['_setDomainName', options.domain]);\n\
    }\n\
    if (options.enhancedLinkAttribution) {\n\
      var protocol = 'https:' === document.location.protocol ? 'https:' : 'http:';\n\
      var pluginUrl = protocol + '//www.google-analytics.com/plugins/ga/inpage_linkid.js';\n\
      window._gaq.push(['_require', 'inpage_linkid', pluginUrl]);\n\
    }\n\
    if (type(options.siteSpeedSampleRate) === 'number') {\n\
      window._gaq.push(['_setSiteSpeedSampleRate', options.siteSpeedSampleRate]);\n\
    }\n\
    if (options.anonymizeIp) {\n\
      window._gaq.push(['_gat._anonymizeIp']);\n\
    }\n\
    if (options.ignoreReferrer) {\n\
      window._gaq.push(['_addIgnoredRef', options.ignoreReferrer]);\n\
    }\n\
    if (options.initialPageview) {\n\
      var path, canon = canonical();\n\
      if (canon) path = url.parse(canon).pathname;\n\
      this.pageview(path);\n\
    }\n\
\n\
    // URLs change if DoubleClick is on. Even though Google Analytics makes a\n\
    // queue, the `_gat` object isn't available until the library loads.\n\
    if (options.doubleClick) {\n\
      load('//stats.g.doubleclick.net/dc.js', ready);\n\
    } else {\n\
      load({\n\
        http  : 'http://www.google-analytics.com/ga.js',\n\
        https : 'https://ssl.google-analytics.com/ga.js'\n\
      }, ready);\n\
    }\n\
  },\n\
\n\
  initializeUniversal: function (options, ready) {\n\
\n\
    // GA-universal lets you set your own queue name\n\
    var global = this.global = 'ga';\n\
\n\
    // and needs to know about this queue name in this special object\n\
    // so that future plugins can also operate on the object\n\
    window['GoogleAnalyticsObject'] = global;\n\
\n\
    // setup the global variable\n\
    window[global] = window[global] || function () {\n\
      (window[global].q = window[global].q || []).push(arguments);\n\
    };\n\
\n\
    // GA also needs to know the current time (all from their snippet)\n\
    window[global].l = 1 * new Date();\n\
\n\
    var createOpts = {};\n\
\n\
    // Apply a bunch of optional settings.\n\
    if (options.domain)\n\
      createOpts.cookieDomain = options.domain || 'none';\n\
    if (type(options.siteSpeedSampleRate) === 'number')\n\
      createOpts.siteSpeedSampleRate = options.siteSpeedSampleRate;\n\
    if (options.anonymizeIp)\n\
      ga('set', 'anonymizeIp', true);\n\
\n\
    ga('create', options.trackingId, createOpts);\n\
\n\
    if (options.initialPageview) {\n\
      var path, canon = canonical();\n\
      if (canon) path = url.parse(canon).pathname;\n\
      this.pageview(path);\n\
    }\n\
\n\
    load('//www.google-analytics.com/analytics.js');\n\
\n\
    // Google makes a queue so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    properties || (properties = {});\n\
\n\
    var value;\n\
\n\
    // Since value is a common property name, ensure it is a number and Google\n\
    // requires that it be an integer.\n\
    if (type(properties.value) === 'number') value = Math.round(properties.value);\n\
\n\
    // Try to check for a `category` and `label`. A `category` is required,\n\
    // so if it's not there we use `'All'` as a default. We can safely push\n\
    // undefined if the special properties don't exist. Try using revenue\n\
    // first, but fall back to a generic `value` as well.\n\
    if (this.options.universalClient) {\n\
      var opts = {};\n\
      if (properties.noninteraction) opts.nonInteraction = properties.noninteraction;\n\
      window[this.global](\n\
        'send',\n\
        'event',\n\
        properties.category || 'All',\n\
        event,\n\
        properties.label,\n\
        Math.round(properties.revenue) || value,\n\
        opts\n\
      );\n\
    } else {\n\
      window._gaq.push([\n\
        '_trackEvent',\n\
        properties.category || 'All',\n\
        event,\n\
        properties.label,\n\
        Math.round(properties.revenue) || value,\n\
        properties.noninteraction\n\
      ]);\n\
    }\n\
  },\n\
\n\
  pageview : function (url) {\n\
    if (this.options.universalClient) {\n\
      window[this.global]('send', 'pageview', url);\n\
    } else {\n\
      window._gaq.push(['_trackPageview', url]);\n\
    }\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/google-analytics.js"
));
require.register("analytics/src/providers/gosquared.js", Function("exports, require, module",
"// http://www.gosquared.com/support\n\
// https://www.gosquared.com/customer/portal/articles/612063-tracker-functions\n\
\n\
var Provider = require('../provider')\n\
  , user     = require('../user')\n\
  , load     = require('load-script')\n\
  , onBody   = require('on-body');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'GoSquared',\n\
\n\
  key : 'siteToken',\n\
\n\
  defaults : {\n\
    siteToken : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    // GoSquared assumes a body in their script, so we need this wrapper.\n\
    onBody(function () {\n\
      var GoSquared = window.GoSquared = {};\n\
      GoSquared.acct = options.siteToken;\n\
      GoSquared.q = [];\n\
      window._gstc_lt =+ (new Date());\n\
\n\
      GoSquared.VisitorName = user.id();\n\
      GoSquared.Visitor = user.traits();\n\
\n\
      load('//d1l6p2sc9645hc.cloudfront.net/tracker.js');\n\
\n\
      // GoSquared makes a queue, so it's ready immediately.\n\
      ready();\n\
    });\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    // TODO figure out if this will actually work. Seems like GoSquared will\n\
    // never know these values are updated.\n\
    if (userId) window.GoSquared.UserName = userId;\n\
    if (traits) window.GoSquared.Visitor = traits;\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    // GoSquared sets a `gs_evt_name` property with a value of the event\n\
    // name, so it relies on properties being an object.\n\
    window.GoSquared.q.push(['TrackEvent', event, properties || {}]);\n\
  },\n\
\n\
  pageview : function (url) {\n\
    window.GoSquared.q.push(['TrackView', url]);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/gosquared.js"
));
require.register("analytics/src/providers/heap.js", Function("exports, require, module",
"// https://heapanalytics.com/docs\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Heap',\n\
\n\
  key : 'apiKey',\n\
\n\
  defaults : {\n\
    apiKey : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window.heap=window.heap||[];window.heap.load=function(a){window._heapid=a;var b=document.createElement(\"script\");b.type=\"text/javascript\",b.async=!0,b.src=(\"https:\"===document.location.protocol?\"https:\":\"http:\")+\"//d36lvucg9kzous.cloudfront.net\";var c=document.getElementsByTagName(\"script\")[0];c.parentNode.insertBefore(b,c);var d=function(a){return function(){heap.push([a].concat(Array.prototype.slice.call(arguments,0)))}},e=[\"identify\",\"track\"];for(var f=0;f<e.length;f++)heap[e[f]]=d(e[f])};\n\
    window.heap.load(options.apiKey);\n\
\n\
    // heap creates its own queue, so we're ready right away\n\
    ready();\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    window.heap.identify(traits);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    window.heap.track(event, properties);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/heap.js"
));
require.register("analytics/src/providers/hittail.js", Function("exports, require, module",
"// http://www.hittail.com\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'HitTail',\n\
\n\
  key : 'siteId',\n\
\n\
  defaults : {\n\
    siteId : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    load('//' + options.siteId + '.hittail.com/mlt.js', ready);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/hittail.js"
));
require.register("analytics/src/providers/hubspot.js", Function("exports, require, module",
"// http://hubspot.clarify-it.com/d/4m62hl\n\
\n\
var Provider = require('../provider')\n\
  , isEmail  = require('is-email')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'HubSpot',\n\
\n\
  key : 'portalId',\n\
\n\
  defaults : {\n\
    portalId : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    // HubSpot checks in their snippet to make sure another script with\n\
    // `hs-analytics` isn't already in the DOM. Seems excessive, but who knows\n\
    // if there's weird deprecation going on :p\n\
    if (!document.getElementById('hs-analytics')) {\n\
      window._hsq = window._hsq || [];\n\
      var script = load('https://js.hubspot.com/analytics/' + (Math.ceil(new Date()/300000)*300000) + '/' + options.portalId + '.js');\n\
      script.id = 'hs-analytics';\n\
    }\n\
\n\
    // HubSpot makes a queue, so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  // HubSpot does not use a userId, but the email address is required on\n\
  // the traits object.\n\
  identify : function (userId, traits) {\n\
    window._hsq.push([\"identify\", traits]);\n\
  },\n\
\n\
  // Event Tracking is available to HubSpot Enterprise customers only. In\n\
  // addition to adding any unique event name, you can also use the id of an\n\
  // existing custom event as the event variable.\n\
  track : function (event, properties) {\n\
    window._hsq.push([\"trackEvent\", event, properties]);\n\
  },\n\
\n\
  // HubSpot doesn't support passing in a custom URL.\n\
  pageview : function (url) {\n\
    window._hsq.push(['_trackPageview']);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/hubspot.js"
));
require.register("analytics/src/providers/index.js", Function("exports, require, module",
"module.exports = [\n\
  require('./adroll'),\n\
  require('./amplitude'),\n\
  require('./bugherd'),\n\
  require('./chartbeat'),\n\
  require('./clicktale'),\n\
  require('./clicky'),\n\
  require('./comscore'),\n\
  require('./crazyegg'),\n\
  require('./customerio'),\n\
  require('./errorception'),\n\
  require('./foxmetrics'),\n\
  require('./gauges'),\n\
  require('./get-satisfaction'),\n\
  require('./google-analytics'),\n\
  require('./gosquared'),\n\
  require('./heap'),\n\
  require('./hittail'),\n\
  require('./hubspot'),\n\
  require('./improvely'),\n\
  require('./intercom'),\n\
  require('./keen-io'),\n\
  require('./kissmetrics'),\n\
  require('./klaviyo'),\n\
  require('./leadlander'),\n\
  require('./livechat'),\n\
  require('./lytics'),\n\
  require('./mixpanel'),\n\
  require('./olark'),\n\
  require('./optimizely'),\n\
  require('./perfect-audience'),\n\
  require('./pingdom'),\n\
  require('./preact'),\n\
  require('./qualaroo'),\n\
  require('./quantcast'),\n\
  require('./sentry'),\n\
  require('./snapengage'),\n\
  require('./usercycle'),\n\
  require('./userfox'),\n\
  require('./uservoice'),\n\
  require('./vero'),\n\
  require('./visual-website-optimizer'),\n\
  require('./woopra')\n\
];\n\
//@ sourceURL=analytics/src/providers/index.js"
));
require.register("analytics/src/providers/improvely.js", Function("exports, require, module",
"// http://www.improvely.com/docs/landing-page-code\r\n\
// http://www.improvely.com/docs/conversion-code\r\n\
// http://www.improvely.com/docs/labeling-visitors\r\n\
\r\n\
var Provider = require('../provider')\r\n\
  , alias    = require('alias')\r\n\
  , load     = require('load-script');\r\n\
\r\n\
\r\n\
module.exports = Provider.extend({\r\n\
\r\n\
  name : 'Improvely',\r\n\
\r\n\
  defaults : {\r\n\
    // Improvely requires two options: `domain` and `projectId`.\r\n\
    domain : null,\r\n\
    projectId : null\r\n\
  },\r\n\
\r\n\
  initialize : function (options, ready) {\r\n\
    window._improvely = window._improvely || [];\r\n\
    window.improvely = window.improvely || {\r\n\
      init  : function (e, t) { window._improvely.push([\"init\", e, t]); },\r\n\
      goal  : function (e) { window._improvely.push([\"goal\", e]); },\r\n\
      label : function (e) { window._improvely.push([\"label\", e]); }\r\n\
    };\r\n\
\r\n\
    load('//' + options.domain + '.iljmp.com/improvely.js');\r\n\
    window.improvely.init(options.domain, options.projectId);\r\n\
\r\n\
    // Improvely creates a queue, so it's ready immediately.\r\n\
    ready();\r\n\
  },\r\n\
\r\n\
  identify : function (userId, traits) {\r\n\
    if (userId) window.improvely.label(userId);\r\n\
  },\r\n\
\r\n\
  track : function (event, properties) {\r\n\
    // Improvely calls `revenue` `amount`, and puts the `event` in properties as\r\n\
    // the `type`.\r\n\
    properties || (properties = {});\r\n\
    properties.type = event;\r\n\
    alias(properties, { 'revenue' : 'amount' });\r\n\
    window.improvely.goal(properties);\r\n\
  }\r\n\
\r\n\
});\r\n\
//@ sourceURL=analytics/src/providers/improvely.js"
));
require.register("analytics/src/providers/intercom.js", Function("exports, require, module",
"// http://docs.intercom.io/\n\
// http://docs.intercom.io/#IntercomJS\n\
\n\
var Provider = require('../provider')\n\
  , extend   = require('extend')\n\
  , load     = require('load-script')\n\
  , isEmail  = require('is-email');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Intercom',\n\
\n\
  // Whether Intercom has already been booted or not. Intercom becomes booted\n\
  // after Intercom('boot', ...) has been called on the first identify.\n\
  booted : false,\n\
\n\
  key : 'appId',\n\
\n\
  defaults : {\n\
    // Intercom's required key.\n\
    appId : null,\n\
    // An optional setting to display the Intercom inbox widget.\n\
    activator : null,\n\
    // Whether to show the count of messages for the inbox widget.\n\
    counter : true\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    load('https://static.intercomcdn.com/intercom.v1.js', ready);\n\
  },\n\
\n\
  identify : function (userId, traits, options) {\n\
    // Don't do anything if we just have traits the first time.\n\
    if (!this.booted && !userId) return;\n\
\n\
    // Intercom specific settings. BACKWARDS COMPATIBILITY: we need to check for\n\
    // the lowercase variant as well.\n\
    options || (options = {});\n\
    var Intercom = options.Intercom || options.intercom || {};\n\
    traits.increments = Intercom.increments;\n\
    traits.user_hash = Intercom.userHash || Intercom.user_hash;\n\
\n\
    // They need `created_at` as a Unix timestamp (seconds).\n\
    if (traits.created) {\n\
      traits.created_at = Math.floor(traits.created/1000);\n\
      delete traits.created;\n\
    }\n\
\n\
    // Convert a `company`'s `created` date.\n\
    if (traits.company && traits.company.created) {\n\
      traits.company.created_at = Math.floor(traits.company.created/1000);\n\
      delete traits.company.created;\n\
    }\n\
\n\
    // Optionally add the inbox widget.\n\
    if (this.options.activator) {\n\
      traits.widget = {\n\
        activator   : this.options.activator,\n\
        use_counter : this.options.counter\n\
      };\n\
    }\n\
\n\
    // If this is the first time we've identified, `boot` instead of `update`\n\
    // and add our one-time boot settings.\n\
    if (this.booted) {\n\
      window.Intercom('update', traits);\n\
    } else {\n\
      extend(traits, {\n\
        app_id  : this.options.appId,\n\
        user_id : userId\n\
      });\n\
      window.Intercom('boot', traits);\n\
    }\n\
\n\
    // Set the booted state, so that we know to call 'update' next time.\n\
    this.booted = true;\n\
  },\n\
\n\
  // Intercom doesn't have a separate `group` method, but they take a\n\
  // `companies` trait for the user.\n\
  group : function (groupId, properties, options) {\n\
    properties.id = groupId;\n\
    window.Intercom('update', { company : properties });\n\
  }\n\
\n\
});\n\
//@ sourceURL=analytics/src/providers/intercom.js"
));
require.register("analytics/src/providers/keen-io.js", Function("exports, require, module",
"// https://keen.io/docs/\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Keen IO',\n\
\n\
  defaults : {\n\
    // The Project ID is **required**.\n\
    projectId : null,\n\
    // The Write Key is **required** to send events.\n\
    writeKey : null,\n\
    // The Read Key is optional, only if you want to \"do analysis\".\n\
    readKey : null,\n\
    // Whether or not to pass pageviews on to Keen IO.\n\
    pageview : true,\n\
    // Whether or not to track an initial pageview on `initialize`.\n\
    initialPageview : true\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window.Keen = window.Keen||{configure:function(e){this._cf=e},addEvent:function(e,t,n,i){this._eq=this._eq||[],this._eq.push([e,t,n,i])},setGlobalProperties:function(e){this._gp=e},onChartsReady:function(e){this._ocrq=this._ocrq||[],this._ocrq.push(e)}};\n\
    window.Keen.configure({\n\
      projectId : options.projectId,\n\
      writeKey  : options.writeKey,\n\
      readKey   : options.readKey\n\
    });\n\
\n\
    load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js');\n\
\n\
    if (options.initialPageview) this.pageview();\n\
\n\
    // Keen IO defines all their functions in the snippet, so they're ready.\n\
    ready();\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    // Use Keen IO global properties to include `userId` and `traits` on\n\
    // every event sent to Keen IO.\n\
    var globalUserProps = {};\n\
    if (userId) globalUserProps.userId = userId;\n\
    if (traits) globalUserProps.traits = traits;\n\
    if (userId || traits) {\n\
      window.Keen.setGlobalProperties(function(eventCollection) {\n\
        return { user: globalUserProps };\n\
      });\n\
    }\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    window.Keen.addEvent(event, properties);\n\
  },\n\
\n\
  pageview : function (url) {\n\
    if (!this.options.pageview) return;\n\
\n\
    var properties = {\n\
      url  : url || document.location.href,\n\
      name : document.title\n\
    };\n\
\n\
    this.track('Loaded a Page', properties);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/keen-io.js"
));
require.register("analytics/src/providers/kissmetrics.js", Function("exports, require, module",
"// http://support.kissmetrics.com/apis/javascript\n\
\n\
var Provider = require('../provider')\n\
  , alias    = require('alias')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'KISSmetrics',\n\
\n\
  key : 'apiKey',\n\
\n\
  defaults : {\n\
    apiKey : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window._kmq = window._kmq || [];\n\
    load('//i.kissmetrics.com/i.js');\n\
    load('//doug1izaerwt3.cloudfront.net/' + options.apiKey + '.1.js');\n\
\n\
    // KISSmetrics creates a queue, so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  // KISSmetrics uses two separate methods: `identify` for storing the\n\
  // `userId`, and `set` for storing `traits`.\n\
  identify : function (userId, traits) {\n\
    if (userId) window._kmq.push(['identify', userId]);\n\
    if (traits) window._kmq.push(['set', traits]);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    // KISSmetrics handles revenue with the `'Billing Amount'` property by\n\
    // default, although it's changeable in the interface.\n\
    if (properties) {\n\
      alias(properties, {\n\
        'revenue' : 'Billing Amount'\n\
      });\n\
    }\n\
\n\
    window._kmq.push(['record', event, properties]);\n\
  },\n\
\n\
  // Although undocumented, KISSmetrics actually supports not passing a second\n\
  // ID, in which case it uses the currenty identified user's ID.\n\
  alias : function (newId, originalId) {\n\
    window._kmq.push(['alias', newId, originalId]);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/kissmetrics.js"
));
require.register("analytics/src/providers/klaviyo.js", Function("exports, require, module",
"// https://www.klaviyo.com/docs\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Klaviyo',\n\
\n\
  key : 'apiKey',\n\
\n\
  defaults : {\n\
    apiKey : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window._learnq = window._learnq || [];\n\
    window._learnq.push(['account', options.apiKey]);\n\
    load('//a.klaviyo.com/media/js/learnmarklet.js');\n\
\n\
    // Klaviyo creats a queue, so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    // Klaviyo requires a `userId` and takes the it on the traits object itself.\n\
    if (!userId) return;\n\
    traits.$id = userId;\n\
    window._learnq.push(['identify', traits]);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    window._learnq.push(['track', event, properties]);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/klaviyo.js"
));
require.register("analytics/src/providers/leadlander.js", Function("exports, require, module",
"var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'LeadLander',\n\
\n\
  key : 'llactid',\n\
\n\
  defaults : {\n\
    llactid : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window.llactid = options.llactid;\n\
    load('//trackalyzer.com/trackalyze.js', ready);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/leadlander.js"
));
require.register("analytics/src/providers/livechat.js", Function("exports, require, module",
"// http://www.livechatinc.com/api/javascript-api\n\
\n\
var Provider = require('../provider')\n\
  , each     = require('each')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'LiveChat',\n\
\n\
  key : 'license',\n\
\n\
  defaults : {\n\
    license : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window.__lc = { license : options.license };\n\
    load('//cdn.livechatinc.com/tracking.js', ready);\n\
  },\n\
\n\
  // LiveChat isn't an analytics service, but we can use the `userId` and\n\
  // `traits` to tag the user with their real name in the chat console.\n\
  identify : function (userId, traits) {\n\
    // In case the LiveChat library hasn't loaded yet.\n\
    if (!window.LC_API) return;\n\
\n\
    // LiveChat takes them in an array format.\n\
    var variables = [];\n\
\n\
    if (userId) variables.push({ name: 'User ID', value: userId });\n\
    if (traits) {\n\
      each(traits, function (key, value) {\n\
        variables.push({\n\
          name  : key,\n\
          value : value\n\
        });\n\
      });\n\
    }\n\
\n\
    window.LC_API.set_custom_variables(variables);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/livechat.js"
));
require.register("analytics/src/providers/lytics.js", Function("exports, require, module",
"// Lytics\n\
// --------\n\
// [Documentation](http://developer.lytics.io/doc#jstag),\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Lytics',\n\
\n\
  key : 'cid',\n\
\n\
  defaults : {\n\
    cid: null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window.jstag = (function () {\n\
      var t={_q:[],_c:{cid:options.cid,url:'//c.lytics.io'},ts:(new Date()).getTime()};\n\
      t.send=function(){\n\
      this._q.push([\"ready\",\"send\",Array.prototype.slice.call(arguments)]);\n\
      return this;\n\
      };\n\
      return t;\n\
    })();\n\
\n\
    load('//c.lytics.io/static/io.min.js');\n\
\n\
    ready();\n\
  },\n\
\n\
  identify: function (userId, traits) {\n\
    traits._uid = userId;\n\
    window.jstag.send(traits);\n\
  },\n\
\n\
  track: function (event, properties) {\n\
    properties._e = event;\n\
    window.jstag.send(properties);\n\
  },\n\
\n\
  pageview: function (url) {\n\
    window.jstag.send();\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/lytics.js"
));
require.register("analytics/src/providers/mixpanel.js", Function("exports, require, module",
"// https://mixpanel.com/docs/integration-libraries/javascript\n\
// https://mixpanel.com/docs/people-analytics/javascript\n\
// https://mixpanel.com/docs/integration-libraries/javascript-full-api\n\
\n\
var Provider = require('../provider')\n\
  , alias    = require('alias')\n\
  , isEmail  = require('is-email')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Mixpanel',\n\
\n\
  key : 'token',\n\
\n\
  defaults : {\n\
    // Whether to call `mixpanel.nameTag` on `identify`.\n\
    nameTag : true,\n\
    // Whether to use Mixpanel's People API.\n\
    people : false,\n\
    // The Mixpanel API token for your account.\n\
    token : null,\n\
    // Whether to track pageviews to Mixpanel.\n\
    pageview : false,\n\
    // Whether to track an initial pageview on initialize.\n\
    initialPageview : false,\n\
    // A custom cookie name to use\n\
    cookieName : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    (function (c, a) {\n\
        window.mixpanel = a;\n\
        var b, d, h, e;\n\
        a._i = [];\n\
        a.init = function (b, c, f) {\n\
          function d(a, b) {\n\
            var c = b.split('.');\n\
            2 == c.length && (a = a[c[0]], b = c[1]);\n\
            a[b] = function () {\n\
                a.push([b].concat(Array.prototype.slice.call(arguments, 0)));\n\
            };\n\
          }\n\
          var g = a;\n\
          'undefined' !== typeof f ? g = a[f] = [] : f = 'mixpanel';\n\
          g.people = g.people || [];\n\
          h = ['disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'alias', 'name_tag', 'set_config', 'people.set', 'people.increment', 'people.track_charge', 'people.append'];\n\
          for (e = 0; e < h.length; e++) d(g, h[e]);\n\
          a._i.push([b, c, f]);\n\
        };\n\
        a.__SV = 1.2;\n\
        // Modification to the snippet: call ready whenever the library has\n\
        // fully loaded.\n\
        load('//cdn.mxpnl.com/libs/mixpanel-2.2.min.js', ready);\n\
    })(document, window.mixpanel || []);\n\
\n\
    // Mixpanel only accepts snake_case options\n\
    options.cookie_name = options.cookieName;\n\
\n\
    // Pass options directly to `init` as the second argument.\n\
    window.mixpanel.init(options.token, options);\n\
\n\
    if (options.initialPageview) this.pageview();\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    // Alias the traits' keys with dollar signs for Mixpanel's API.\n\
    alias(traits, {\n\
      'created'   : '$created',\n\
      'email'     : '$email',\n\
      'firstName' : '$first_name',\n\
      'lastName'  : '$last_name',\n\
      'lastSeen'  : '$last_seen',\n\
      'name'      : '$name',\n\
      'username'  : '$username',\n\
      'phone'     : '$phone'\n\
    });\n\
\n\
    // Finally, call all of the identify equivalents. Verify certain calls\n\
    // against options to make sure they're enabled.\n\
    if (userId) {\n\
      window.mixpanel.identify(userId);\n\
      if (this.options.nameTag) window.mixpanel.name_tag(traits && traits.$email || userId);\n\
    }\n\
    if (traits) {\n\
      window.mixpanel.register(traits);\n\
      if (this.options.people) window.mixpanel.people.set(traits);\n\
    }\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    window.mixpanel.track(event, properties);\n\
\n\
    // Mixpanel handles revenue with a `transaction` call in their People\n\
    // feature. So if we're using people, record a transcation.\n\
    if (properties && properties.revenue && this.options.people) {\n\
      window.mixpanel.people.track_charge(properties.revenue);\n\
    }\n\
  },\n\
\n\
  // Mixpanel doesn't actually track the pageviews, but they do show up in the\n\
  // Mixpanel stream.\n\
  pageview : function (url) {\n\
    window.mixpanel.track_pageview(url);\n\
\n\
    // If they don't want pageviews tracked, leave now.\n\
    if (!this.options.pageview) return;\n\
\n\
    var properties = {\n\
      url  : url || document.location.href,\n\
      name : document.title\n\
    };\n\
\n\
    this.track('Loaded a Page', properties);\n\
  },\n\
\n\
  // Although undocumented, Mixpanel actually supports the `originalId`. It\n\
  // just usually defaults to the current user's `distinct_id`.\n\
  alias : function (newId, originalId) {\n\
\n\
    if(window.mixpanel.get_distinct_id &&\n\
       window.mixpanel.get_distinct_id() === newId) return;\n\
\n\
    // HACK: internal mixpanel API to ensure we don't overwrite.\n\
    if(window.mixpanel.get_property &&\n\
       window.mixpanel.get_property('$people_distinct_id') === newId) return;\n\
\n\
    window.mixpanel.alias(newId, originalId);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/mixpanel.js"
));
require.register("analytics/src/providers/olark.js", Function("exports, require, module",
"// http://www.olark.com/documentation\n\
\n\
var Provider = require('../provider')\n\
  , isEmail  = require('is-email');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Olark',\n\
\n\
  key : 'siteId',\n\
\n\
  chatting : false,\n\
\n\
  defaults : {\n\
    siteId : null,\n\
    // Whether to use the user's name or email in the Olark chat console.\n\
    identify : true,\n\
    // Whether to log pageviews to the Olark chat console.\n\
    track : false,\n\
    // Whether to log pageviews to the Olark chat console.\n\
    pageview : true\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window.olark||(function(c){var f=window,d=document,l=f.location.protocol==\"https:\"?\"https:\":\"http:\",z=c.name,r=\"load\";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z](\"call\",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent(\"on\"+r,s);var ld=function(){function p(hd){hd=\"head\";return[\"<\",hd,\"></\",hd,\"><\",i,' onl' + 'oad=\"var d=',g,\";d.getElementsByTagName('head')[0].\",j,\"(d.\",h,\"('script')).\",k,\"='\",l,\"//\",a.l,\"'\",'\"',\"></\",i,\">\"].join(\"\")}var i=\"body\",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j=\"appendChild\",h=\"createElement\",k=\"src\",n=d[h](\"div\"),v=n[j](d[h](z)),b=d[h](\"iframe\"),g=\"document\",e=\"domain\",o;n.style.display=\"none\";m.insertBefore(n,m.firstChild).id=z;b.frameBorder=\"0\";b.id=z+\"-loader\";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src=\"javascript:false\"}b.allowTransparency=\"true\";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o=\"javascript:var d=\"+g+\".open();d.domain='\"+d.domain+\"';\";b[k]=o+\"void(0);\"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write(\"'+p().replace(/\"/g,String.fromCharCode(92)+'\"')+'\");d.close();'}a.P(2)};ld()};nt()})({loader: \"static.olark.com/jsclient/loader0.js\",name:\"olark\",methods:[\"configure\",\"extend\",\"declare\",\"identify\"]});\n\
    window.olark.identify(options.siteId);\n\
\n\
    // Set up event handlers for chat box open and close so that\n\
    // we know whether a conversation is active. If it is active,\n\
    // then we'll send track and pageview information.\n\
    var self = this;\n\
    window.olark('api.box.onExpand', function () { self.chatting = true; });\n\
    window.olark('api.box.onShrink', function () { self.chatting = false; });\n\
\n\
    // Olark creates it's method in the snippet, so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  // Update traits about the user in Olark to make the operator's life easier.\n\
  identify : function (userId, traits) {\n\
    if (!this.options.identify) return;\n\
\n\
    var email    = traits.email\n\
      , name     = traits.name || traits.firstName\n\
      , phone    = traits.phone\n\
      , nickname = name || email || userId;\n\
\n\
    // If we have a name and an email, add the email too to be more helpful.\n\
    if (name && email) nickname += ' ('+email+')';\n\
\n\
    // Call all of Olark's settings APIs.\n\
    window.olark('api.visitor.updateCustomFields', traits);\n\
    if (email)    window.olark('api.visitor.updateEmailAddress', { emailAddress : email });\n\
    if (name)     window.olark('api.visitor.updateFullName', { fullName : name });\n\
    if (phone)    window.olark('api.visitor.updatePhoneNumber', { phoneNumber : phone });\n\
    if (nickname) window.olark('api.chat.updateVisitorNickname', { snippet : nickname });\n\
  },\n\
\n\
  // Log events the user triggers to the chat console, if you so desire it.\n\
  track : function (event, properties) {\n\
    if (!this.options.track || !this.chatting) return;\n\
\n\
    // To stay consistent with olark's default messages, it's all lowercase.\n\
    window.olark('api.chat.sendNotificationToOperator', {\n\
      body : 'visitor triggered \"'+event+'\"'\n\
    });\n\
  },\n\
\n\
  // Mimic the functionality Olark has for normal pageviews with pseudo-\n\
  // pageviews, telling the operator when a visitor changes pages.\n\
  pageview : function (url) {\n\
    if (!this.options.pageview || !this.chatting) return;\n\
\n\
    // To stay consistent with olark's default messages, it's all lowercase.\n\
    window.olark('api.chat.sendNotificationToOperator', {\n\
      body : 'looking at ' + window.location.href\n\
    });\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/olark.js"
));
require.register("analytics/src/providers/optimizely.js", Function("exports, require, module",
"// https://www.optimizely.com/docs/api\n\
\n\
var each      = require('each')\n\
  , nextTick  = require('next-tick')\n\
  , Provider  = require('../provider');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Optimizely',\n\
\n\
  defaults : {\n\
    // Whether to replay variations into other enabled integrations as traits.\n\
    variations : true\n\
  },\n\
\n\
  initialize : function (options, ready, analytics) {\n\
    // Create the `optimizely` object in case it doesn't exist already.\n\
    // https://www.optimizely.com/docs/api#function-calls\n\
    window.optimizely = window.optimizely || [];\n\
\n\
    // If the `variations` option is true, replay our variations on the next\n\
    // tick to wait for the entire library to be ready for replays.\n\
    if (options.variations) {\n\
      var self = this;\n\
      nextTick(function () { self.replay(); });\n\
    }\n\
\n\
    // Optimizely should be on the page already, so it's always ready.\n\
    ready();\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    // Optimizely takes revenue as cents, not dollars.\n\
    if (properties && properties.revenue) properties.revenue = properties.revenue * 100;\n\
\n\
    window.optimizely.push(['trackEvent', event, properties]);\n\
  },\n\
\n\
  replay : function () {\n\
    // Make sure we have access to Optimizely's `data` dictionary.\n\
    var data = window.optimizely.data;\n\
    if (!data) return;\n\
\n\
    // Grab a few pieces of data we'll need for replaying.\n\
    var experiments       = data.experiments\n\
      , variationNamesMap = data.state.variationNamesMap;\n\
\n\
    // Create our traits object to add variations to.\n\
    var traits = {};\n\
\n\
    // Loop through all the experiement the user has been assigned a variation\n\
    // for and add them to our traits.\n\
    each(variationNamesMap, function (experimentId, variation) {\n\
      traits['Experiment: ' + experiments[experimentId].name] = variation;\n\
    });\n\
\n\
    this.analytics.identify(traits);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/optimizely.js"
));
require.register("analytics/src/providers/perfect-audience.js", Function("exports, require, module",
"// https://www.perfectaudience.com/docs#javascript_api_autoopen\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Perfect Audience',\n\
\n\
  key : 'siteId',\n\
\n\
  defaults : {\n\
    siteId : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window._pa || (window._pa = {});\n\
    load('//tag.perfectaudience.com/serve/' + options.siteId + '.js', ready);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    window._pa.track(event, properties);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/perfect-audience.js"
));
require.register("analytics/src/providers/pingdom.js", Function("exports, require, module",
"var date     = require('load-date')\n\
  , Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Pingdom',\n\
\n\
  key : 'id',\n\
\n\
  defaults : {\n\
    id : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
\n\
    window._prum = [\n\
      ['id', options.id],\n\
      ['mark', 'firstbyte', date.getTime()]\n\
    ];\n\
\n\
    // We've replaced the original snippet loader with our own load method.\n\
    load('//rum-static.pingdom.net/prum.min.js', ready);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/pingdom.js"
));
require.register("analytics/src/providers/preact.js", Function("exports, require, module",
"// http://www.preact.io/api/javascript\n\
\n\
var Provider = require('../provider')\n\
  , isEmail  = require('is-email')\n\
  , load     = require('load-script');\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Preact',\n\
\n\
  key : 'projectCode',\n\
\n\
  defaults : {\n\
    projectCode    : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    var _lnq = window._lnq = window._lnq || [];\n\
    _lnq.push([\"_setCode\", options.projectCode]);\n\
\n\
    load('//d2bbvl6dq48fa6.cloudfront.net/js/ln-2.4.min.js');\n\
    ready();\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    // Don't do anything if we just have traits. Preact requires a `userId`.\n\
    if (!userId) return;\n\
\n\
    // Swap the `created` trait to the `created_at` that Preact needs\n\
    // and convert it from milliseconds to seconds.\n\
    if (traits.created) {\n\
      traits.created_at = Math.floor(traits.created/1000);\n\
      delete traits.created;\n\
    }\n\
\n\
    window._lnq.push(['_setPersonData', {\n\
      name       : traits.name,\n\
      email      : traits.email,\n\
      uid        : userId,\n\
      properties : traits\n\
    }]);\n\
  },\n\
\n\
  group : function (groupId, properties) {\n\
    if (!groupId) return;\n\
    properties.id = groupId;\n\
    window._lnq.push(['_setAccount', properties]);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    properties || (properties = {});\n\
\n\
    // Preact takes a few special properties, and the rest in `extras`. So first\n\
    // convert and remove the special ones from `properties`.\n\
    var special = { name : event };\n\
\n\
    // They take `revenue` in cents.\n\
    if (properties.revenue) {\n\
      special.revenue = properties.revenue * 100;\n\
      delete properties.revenue;\n\
    }\n\
\n\
    if (properties.note) {\n\
      special.note = properties.note;\n\
      delete properties.note;\n\
    }\n\
\n\
    window._lnq.push(['_logEvent', special, properties]);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/preact.js"
));
require.register("analytics/src/providers/qualaroo.js", Function("exports, require, module",
"// http://help.qualaroo.com/customer/portal/articles/731085-identify-survey-nudge-takers\n\
// http://help.qualaroo.com/customer/portal/articles/731091-set-additional-user-properties\n\
\n\
var Provider = require('../provider')\n\
  , isEmail  = require('is-email')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Qualaroo',\n\
\n\
  defaults : {\n\
    // Qualaroo has two required options.\n\
    customerId : null,\n\
    siteToken : null,\n\
    // Whether to record traits when a user triggers an event. This can be\n\
    // useful for sending targetted questionnaries.\n\
    track : false\n\
  },\n\
\n\
  // Qualaroo's script has two options in its URL.\n\
  initialize : function (options, ready) {\n\
    window._kiq = window._kiq || [];\n\
    load('//s3.amazonaws.com/ki.js/' + options.customerId + '/' + options.siteToken + '.js');\n\
\n\
    // Qualaroo creates a queue, so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  // Qualaroo uses two separate methods: `identify` for storing the `userId`,\n\
  // and `set` for storing `traits`.\n\
  identify : function (userId, traits) {\n\
    var identity = traits.email || userId;\n\
    if (identity) window._kiq.push(['identify', identity]);\n\
    if (traits) window._kiq.push(['set', traits]);\n\
  },\n\
\n\
  // Qualaroo doesn't have `track` method yet, but to allow the users to do\n\
  // targetted questionnaires we can set name-value pairs on the user properties\n\
  // that apply to the current visit.\n\
  track : function (event, properties) {\n\
    if (!this.options.track) return;\n\
\n\
    // Create a name-value pair that will be pretty unique. For an event like\n\
    // 'Loaded a Page' this will make it 'Triggered: Loaded a Page'.\n\
    var traits = {};\n\
    traits['Triggered: ' + event] = true;\n\
\n\
    // Fire a normal identify, with traits only.\n\
    this.identify(null, traits);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/qualaroo.js"
));
require.register("analytics/src/providers/quantcast.js", Function("exports, require, module",
"// https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Quantcast',\n\
\n\
  key : 'pCode',\n\
\n\
  defaults : {\n\
    pCode : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window._qevents = window._qevents || [];\n\
    window._qevents.push({ qacct: options.pCode });\n\
    load({\n\
      http  : 'http://edge.quantserve.com/quant.js',\n\
      https : 'https://secure.quantserve.com/quant.js'\n\
    }, ready);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/quantcast.js"
));
require.register("analytics/src/providers/sentry.js", Function("exports, require, module",
"// http://raven-js.readthedocs.org/en/latest/config/index.html\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Sentry',\n\
\n\
  key : 'config',\n\
\n\
  defaults : {\n\
    config : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    load('//d3nslu0hdya83q.cloudfront.net/dist/1.0/raven.min.js', function () {\n\
      // For now, Raven basically requires `install` to be called.\n\
      // https://github.com/getsentry/raven-js/blob/master/src/raven.js#L87\n\
      window.Raven.config(options.config).install();\n\
      ready();\n\
    });\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    traits.id = userId;\n\
    window.Raven.setUser(traits);\n\
  },\n\
\n\
  // Raven will automatically use `captureMessage` if the error is a string.\n\
  log : function (error, properties) {\n\
    window.Raven.captureException(error, properties);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/sentry.js"
));
require.register("analytics/src/providers/snapengage.js", Function("exports, require, module",
"// http://help.snapengage.com/installation-guide-getting-started-in-a-snap/\n\
\n\
var Provider = require('../provider')\n\
  , isEmail  = require('is-email')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'SnapEngage',\n\
\n\
  key : 'apiKey',\n\
\n\
  defaults : {\n\
    apiKey : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    load('//commondatastorage.googleapis.com/code.snapengage.com/js/' + options.apiKey + '.js', ready);\n\
  },\n\
\n\
  // Set the email in the chat window if we have it.\n\
  identify : function (userId, traits, options) {\n\
    if (!traits.email) return;\n\
    window.SnapABug.setUserEmail(traits.email);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/snapengage.js"
));
require.register("analytics/src/providers/usercycle.js", Function("exports, require, module",
"// http://docs.usercycle.com/javascript_api\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script')\n\
  , user     = require('../user');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'USERcycle',\n\
\n\
  key : 'key',\n\
\n\
  defaults : {\n\
    key : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window._uc = window._uc || [];\n\
    window._uc.push(['_key', options.key]);\n\
    load('//api.usercycle.com/javascripts/track.js');\n\
\n\
    // USERcycle makes a queue, so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    if (userId) window._uc.push(['uid', userId]);\n\
\n\
    // USERcycle has a special \"hidden\" event that is used just for retention measurement.\n\
    // Lukas suggested on 6/4/2013 that we send traits on that event, since they use the\n\
    // the latest value of every event property as a \"trait\"\n\
    window._uc.push(['action', 'came_back', traits]);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    window._uc.push(['action', event, properties]);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/usercycle.js"
));
require.register("analytics/src/providers/userfox.js", Function("exports, require, module",
"// https://www.userfox.com/docs/\n\
\n\
var Provider = require('../provider')\n\
  , extend   = require('extend')\n\
  , load     = require('load-script')\n\
  , isEmail  = require('is-email');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'userfox',\n\
\n\
  key : 'clientId',\n\
\n\
  defaults : {\n\
    // userfox's required key.\n\
    clientId : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window._ufq = window._ufq || [];\n\
    load('//d2y71mjhnajxcg.cloudfront.net/js/userfox-stable.js');\n\
\n\
    // userfox creates its own queue, so we're ready right away.\n\
    ready();\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    if (!traits.email) return;\n\
\n\
    // Initialize the library with the email now that we have it.\n\
    window._ufq.push(['init', {\n\
      clientId : this.options.clientId,\n\
      email    : traits.email\n\
    }]);\n\
\n\
    // Record traits to \"track\" if we have the required signup date `created`.\n\
    // userfox takes `signup_date` as a string of seconds since the epoch.\n\
    if (traits.created) {\n\
      traits.signup_date = (traits.created.getTime() / 1000).toString();\n\
      delete traits.created;\n\
      window._ufq.push(['track', traits]);\n\
    }\n\
  }\n\
\n\
});\n\
//@ sourceURL=analytics/src/providers/userfox.js"
));
require.register("analytics/src/providers/uservoice.js", Function("exports, require, module",
"// http://feedback.uservoice.com/knowledgebase/articles/225-how-do-i-pass-custom-data-through-the-widget-and-i\n\
\n\
var Provider = require('../provider')\n\
  , load     = require('load-script')\n\
  , alias    = require('alias')\n\
  , clone    = require('clone');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'UserVoice',\n\
\n\
  defaults : {\n\
    // These first two options are required.\n\
    widgetId          : null,\n\
    forumId           : null,\n\
    // Should we show the tab automatically?\n\
    showTab           : true,\n\
    // There's tons of options for the tab.\n\
    mode              : 'full',\n\
    primaryColor      : '#cc6d00',\n\
    linkColor         : '#007dbf',\n\
    defaultMode       : 'support',\n\
    tabLabel          : 'Feedback & Support',\n\
    tabColor          : '#cc6d00',\n\
    tabPosition       : 'middle-right',\n\
    tabInverted       : false\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window.UserVoice = window.UserVoice || [];\n\
    load('//widget.uservoice.com/' + options.widgetId + '.js', ready);\n\
\n\
    var optionsClone = clone(options);\n\
    alias(optionsClone, {\n\
      'forumId'         : 'forum_id',\n\
      'primaryColor'    : 'primary_color',\n\
      'linkColor'       : 'link_color',\n\
      'defaultMode'     : 'default_mode',\n\
      'tabLabel'        : 'tab_label',\n\
      'tabColor'        : 'tab_color',\n\
      'tabPosition'     : 'tab_position',\n\
      'tabInverted'     : 'tab_inverted'\n\
    });\n\
\n\
    // If we don't automatically show the tab, let them show it via\n\
    // javascript. This is the default name for the function in their snippet.\n\
    window.showClassicWidget = function (showWhat) {\n\
      window.UserVoice.push([showWhat || 'showLightbox', 'classic_widget', optionsClone]);\n\
    };\n\
\n\
    // If we *do* automatically show the tab, get on with it!\n\
    if (options.showTab) {\n\
      window.showClassicWidget('showTab');\n\
    }\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    // Pull the ID into traits.\n\
    traits.id = userId;\n\
    window.UserVoice.push(['setCustomFields', traits]);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/uservoice.js"
));
require.register("analytics/src/providers/vero.js", Function("exports, require, module",
"// https://github.com/getvero/vero-api/blob/master/sections/js.md\n\
\n\
var Provider = require('../provider')\n\
  , isEmail  = require('is-email')\n\
  , load     = require('load-script');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Vero',\n\
\n\
  key : 'apiKey',\n\
\n\
  defaults : {\n\
    apiKey : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    window._veroq = window._veroq || [];\n\
    window._veroq.push(['init', { api_key: options.apiKey }]);\n\
    load('//d3qxef4rp70elm.cloudfront.net/m.js');\n\
\n\
    // Vero creates a queue, so it's ready immediately.\n\
    ready();\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    // Don't do anything if we just have traits, because Vero\n\
    // requires a `userId`.\n\
    if (!userId || !traits.email) return;\n\
\n\
    // Vero takes the `userId` as part of the traits object.\n\
    traits.id = userId;\n\
\n\
    window._veroq.push(['user', traits]);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    window._veroq.push(['track', event, properties]);\n\
  }\n\
\n\
});//@ sourceURL=analytics/src/providers/vero.js"
));
require.register("analytics/src/providers/visual-website-optimizer.js", Function("exports, require, module",
"// http://v2.visualwebsiteoptimizer.com/tools/get_tracking_code.php\n\
// http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/\n\
\n\
var each = require('each')\n\
  , inherit = require('inherit')\n\
  , nextTick = require('next-tick')\n\
  , Provider = require('../provider');\n\
\n\
\n\
/**\n\
 * Expose `VWO`.\n\
 */\n\
\n\
module.exports = VWO;\n\
\n\
\n\
/**\n\
 * `VWO` inherits from the generic `Provider`.\n\
 */\n\
\n\
function VWO () {\n\
  Provider.apply(this, arguments);\n\
}\n\
\n\
inherit(VWO, Provider);\n\
\n\
\n\
/**\n\
 * Name.\n\
 */\n\
\n\
VWO.prototype.name = 'Visual Website Optimizer';\n\
\n\
\n\
/**\n\
 * Default options.\n\
 */\n\
\n\
VWO.prototype.defaults = {\n\
  // Whether to replay variations into other integrations as traits.\n\
  replay : true\n\
};\n\
\n\
\n\
/**\n\
 * Initialize.\n\
 */\n\
\n\
VWO.prototype.initialize = function (options, ready) {\n\
  if (options.replay) this.replay();\n\
  ready();\n\
};\n\
\n\
\n\
/**\n\
 * Replay the experiments the user has seen as traits to all other integrations.\n\
 * Wait for the next tick to replay so that the `analytics` object and all of\n\
 * the integrations are fully initialized.\n\
 */\n\
\n\
VWO.prototype.replay = function () {\n\
  var analytics = this.analytics;\n\
  nextTick(function () {\n\
    experiments(function (err, traits) {\n\
      if (traits) analytics.identify(traits);\n\
    });\n\
  });\n\
};\n\
\n\
\n\
/**\n\
 * Get dictionary of experiment keys and variations.\n\
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/\n\
 *\n\
 * @param  {Function} callback  Called with `err, experiments`.\n\
 * @return {Object}             Dictionary of experiments and variations.\n\
 */\n\
\n\
function experiments (callback) {\n\
  enqueue(function () {\n\
    var data = {};\n\
    var ids = window._vwo_exp_ids;\n\
    if (!ids) return callback();\n\
    each(ids, function (id) {\n\
      var name = variation(id);\n\
      if (name) data['Experiment: ' + id] = name;\n\
    });\n\
    callback(null, data);\n\
  });\n\
}\n\
\n\
\n\
/**\n\
 * Add a function to the VWO queue, creating one if it doesn't exist.\n\
 *\n\
 * @param {Function} fn  Function to enqueue.\n\
 */\n\
\n\
function enqueue (fn) {\n\
  window._vis_opt_queue || (window._vis_opt_queue = []);\n\
  window._vis_opt_queue.push(fn);\n\
}\n\
\n\
\n\
/**\n\
 * Get the chosen variation's name from an experiment `id`.\n\
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/\n\
 *\n\
 * @param  {String} id  ID of the experiment to read.\n\
 * @return {String}     Variation name.\n\
 */\n\
\n\
function variation (id) {\n\
  var experiments = window._vwo_exp;\n\
  if (!experiments) return null;\n\
  var experiment = experiments[id];\n\
  var variationId = experiment.combination_chosen;\n\
  return variationId ? experiment.comb_n[variationId] : null;\n\
}//@ sourceURL=analytics/src/providers/visual-website-optimizer.js"
));
require.register("analytics/src/providers/woopra.js", Function("exports, require, module",
"// http://www.woopra.com/docs/setup/javascript-tracking/\n\
\n\
var Provider = require('../provider')\n\
  , each     = require('each')\n\
  , extend   = require('extend')\n\
  , isEmail  = require('is-email')\n\
  , load     = require('load-script')\n\
  , type     = require('type')\n\
  , user     = require('../user');\n\
\n\
\n\
module.exports = Provider.extend({\n\
\n\
  name : 'Woopra',\n\
\n\
  key : 'domain',\n\
\n\
  defaults : {\n\
    domain : null\n\
  },\n\
\n\
  initialize : function (options, ready) {\n\
    // Woopra gives us a nice ready callback.\n\
    var self = this;\n\
\n\
    window.woopraReady = function (tracker) {\n\
      tracker.setDomain(self.options.domain);\n\
      tracker.setIdleTimeout(300000);\n\
\n\
      var userId = user.id()\n\
        , traits = user.traits();\n\
\n\
      addTraits(userId, traits, tracker);\n\
      tracker.track();\n\
\n\
      ready();\n\
      return false;\n\
    };\n\
\n\
    load('//static.woopra.com/js/woopra.js');\n\
  },\n\
\n\
  identify : function (userId, traits) {\n\
    // We aren't guaranteed a tracker.\n\
    if (!window.woopraTracker) return;\n\
    addTraits(userId, traits, window.woopraTracker);\n\
  },\n\
\n\
  track : function (event, properties) {\n\
    // We aren't guaranteed a tracker.\n\
    if (!window.woopraTracker) return;\n\
\n\
    // Woopra takes its `event` as the `name` key.\n\
    properties || (properties = {});\n\
    properties.name = event;\n\
\n\
    window.woopraTracker.pushEvent(properties);\n\
  }\n\
\n\
});\n\
\n\
\n\
/**\n\
 * Convenience function for updating the userId and traits.\n\
 *\n\
 * @param {String} userId    The user's ID.\n\
 * @param {Object} traits    The user's traits.\n\
 * @param {Tracker} tracker  The Woopra tracker object.\n\
 */\n\
\n\
function addTraits (userId, traits, tracker) {\n\
  // Move a `userId` into `traits`.\n\
  if (userId) traits.id = userId;\n\
  each(traits, function (key, value) {\n\
    // Woopra seems to only support strings as trait values.\n\
    if ('string' === type(value)) tracker.addVisitorProperty(key, value);\n\
  });\n\
}//@ sourceURL=analytics/src/providers/woopra.js"
));


























require.alias("avetisk-defaults/index.js", "analytics/deps/defaults/index.js");
require.alias("avetisk-defaults/index.js", "defaults/index.js");

require.alias("component-clone/index.js", "analytics/deps/clone/index.js");
require.alias("component-clone/index.js", "clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("component-cookie/index.js", "analytics/deps/cookie/index.js");
require.alias("component-cookie/index.js", "cookie/index.js");

require.alias("component-each/index.js", "analytics/deps/each/index.js");
require.alias("component-each/index.js", "each/index.js");
require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");

require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("component-event/index.js", "analytics/deps/event/index.js");
require.alias("component-event/index.js", "event/index.js");

require.alias("component-inherit/index.js", "analytics/deps/inherit/index.js");
require.alias("component-inherit/index.js", "inherit/index.js");

require.alias("component-object/index.js", "analytics/deps/object/index.js");
require.alias("component-object/index.js", "object/index.js");

require.alias("component-querystring/index.js", "analytics/deps/querystring/index.js");
require.alias("component-querystring/index.js", "querystring/index.js");
require.alias("component-trim/index.js", "component-querystring/deps/trim/index.js");

require.alias("component-type/index.js", "analytics/deps/type/index.js");
require.alias("component-type/index.js", "type/index.js");

require.alias("component-url/index.js", "analytics/deps/url/index.js");
require.alias("component-url/index.js", "url/index.js");

require.alias("segmentio-after/index.js", "analytics/deps/after/index.js");
require.alias("segmentio-after/index.js", "after/index.js");

require.alias("segmentio-alias/index.js", "analytics/deps/alias/index.js");
require.alias("segmentio-alias/index.js", "alias/index.js");

require.alias("segmentio-bind-all/index.js", "analytics/deps/bind-all/index.js");
require.alias("segmentio-bind-all/index.js", "analytics/deps/bind-all/index.js");
require.alias("segmentio-bind-all/index.js", "bind-all/index.js");
require.alias("component-bind/index.js", "segmentio-bind-all/deps/bind/index.js");

require.alias("component-type/index.js", "segmentio-bind-all/deps/type/index.js");

require.alias("segmentio-bind-all/index.js", "segmentio-bind-all/index.js");
require.alias("segmentio-canonical/index.js", "analytics/deps/canonical/index.js");
require.alias("segmentio-canonical/index.js", "canonical/index.js");

require.alias("segmentio-extend/index.js", "analytics/deps/extend/index.js");
require.alias("segmentio-extend/index.js", "extend/index.js");

require.alias("segmentio-is-email/index.js", "analytics/deps/is-email/index.js");
require.alias("segmentio-is-email/index.js", "is-email/index.js");

require.alias("segmentio-is-meta/index.js", "analytics/deps/is-meta/index.js");
require.alias("segmentio-is-meta/index.js", "is-meta/index.js");

require.alias("segmentio-json/index.js", "analytics/deps/json/index.js");
require.alias("segmentio-json/index.js", "json/index.js");
require.alias("component-json-fallback/index.js", "segmentio-json/deps/json-fallback/index.js");

require.alias("segmentio-load-date/index.js", "analytics/deps/load-date/index.js");
require.alias("segmentio-load-date/index.js", "load-date/index.js");

require.alias("segmentio-load-script/index.js", "analytics/deps/load-script/index.js");
require.alias("segmentio-load-script/index.js", "load-script/index.js");
require.alias("component-type/index.js", "segmentio-load-script/deps/type/index.js");

require.alias("segmentio-new-date/index.js", "analytics/deps/new-date/index.js");
require.alias("segmentio-new-date/index.js", "new-date/index.js");
require.alias("segmentio-type/index.js", "segmentio-new-date/deps/type/index.js");

require.alias("segmentio-on-body/index.js", "analytics/deps/on-body/index.js");
require.alias("segmentio-on-body/index.js", "on-body/index.js");
require.alias("component-each/index.js", "segmentio-on-body/deps/each/index.js");
require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");

require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("segmentio-store.js/store.js", "analytics/deps/store/store.js");
require.alias("segmentio-store.js/store.js", "analytics/deps/store/index.js");
require.alias("segmentio-store.js/store.js", "store/index.js");
require.alias("segmentio-json/index.js", "segmentio-store.js/deps/json/index.js");
require.alias("component-json-fallback/index.js", "segmentio-json/deps/json-fallback/index.js");

require.alias("segmentio-store.js/store.js", "segmentio-store.js/index.js");
require.alias("segmentio-top-domain/index.js", "analytics/deps/top-domain/index.js");
require.alias("segmentio-top-domain/index.js", "analytics/deps/top-domain/index.js");
require.alias("segmentio-top-domain/index.js", "top-domain/index.js");
require.alias("component-url/index.js", "segmentio-top-domain/deps/url/index.js");

require.alias("segmentio-top-domain/index.js", "segmentio-top-domain/index.js");
require.alias("timoxley-next-tick/index.js", "analytics/deps/next-tick/index.js");
require.alias("timoxley-next-tick/index.js", "next-tick/index.js");

require.alias("yields-prevent/index.js", "analytics/deps/prevent/index.js");
require.alias("yields-prevent/index.js", "prevent/index.js");

require.alias("analytics/src/index.js", "analytics/index.js");
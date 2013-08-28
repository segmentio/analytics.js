;(function(){

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
require.register("avetisk-defaults/index.js", function(exports, require, module){
'use strict';

/**
 * Merge default values.
 *
 * @param {Object} dest
 * @param {Object} defaults
 * @return {Object}
 * @api public
 */
var defaults = function (dest, src, recursive) {
  for (var prop in src) {
    if (recursive && dest[prop] instanceof Object && src[prop] instanceof Object) {
      dest[prop] = defaults(dest[prop], src[prop], true);
    } else if (! (prop in dest)) {
      dest[prop] = src[prop];
    }
  }

  return dest;
};

/**
 * Expose `defaults`.
 */
module.exports = defaults;

});
require.register("component-clone/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var type;

try {
  type = require('type');
} catch(e){
  type = require('type-component');
}

/**
 * Module exports.
 */

module.exports = clone;

/**
 * Clones objects.
 *
 * @param {Mixed} any object
 * @api public
 */

function clone(obj){
  switch (type(obj)) {
    case 'object':
      var copy = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          copy[key] = clone(obj[key]);
        }
      }
      return copy;

    case 'array':
      var copy = new Array(obj.length);
      for (var i = 0, l = obj.length; i < l; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;

    case 'regexp':
      // from millermedeiros/amd-utils - MIT
      var flags = '';
      flags += obj.multiline ? 'm' : '';
      flags += obj.global ? 'g' : '';
      flags += obj.ignoreCase ? 'i' : '';
      return new RegExp(obj.source, flags);

    case 'date':
      return new Date(obj.getTime());

    default: // string, number, boolean, …
      return obj;
  }
}

});
require.register("component-cookie/index.js", function(exports, require, module){
/**
 * Encode.
 */

var encode = encodeURIComponent;

/**
 * Decode.
 */

var decode = decodeURIComponent;

/**
 * Set or get cookie `name` with `value` and `options` object.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @return {Mixed}
 * @api public
 */

module.exports = function(name, value, options){
  switch (arguments.length) {
    case 3:
    case 2:
      return set(name, value, options);
    case 1:
      return get(name);
    default:
      return all();
  }
};

/**
 * Set cookie `name` to `value`.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @api private
 */

function set(name, value, options) {
  options = options || {};
  var str = encode(name) + '=' + encode(value);

  if (null == value) options.maxage = -1;

  if (options.maxage) {
    options.expires = new Date(+new Date + options.maxage);
  }

  if (options.path) str += '; path=' + options.path;
  if (options.domain) str += '; domain=' + options.domain;
  if (options.expires) str += '; expires=' + options.expires.toUTCString();
  if (options.secure) str += '; secure';

  document.cookie = str;
}

/**
 * Return all cookies.
 *
 * @return {Object}
 * @api private
 */

function all() {
  return parse(document.cookie);
}

/**
 * Get cookie `name`.
 *
 * @param {String} name
 * @return {String}
 * @api private
 */

function get(name) {
  return all()[name];
}

/**
 * Parse cookie `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parse(str) {
  var obj = {};
  var pairs = str.split(/ *; */);
  var pair;
  if ('' == pairs[0]) return obj;
  for (var i = 0; i < pairs.length; ++i) {
    pair = pairs[i].split('=');
    obj[decode(pair[0])] = decode(pair[1]);
  }
  return obj;
}

});
require.register("component-to-function/index.js", function(exports, require, module){

/**
 * Expose `toFunction()`.
 */

module.exports = toFunction;

/**
 * Convert `obj` to a `Function`.
 *
 * @param {Mixed} obj
 * @return {Function}
 * @api private
 */

function toFunction(obj) {
  switch ({}.toString.call(obj)) {
    case '[object Object]':
      return objectToFunction(obj);
    case '[object Function]':
      return obj;
    case '[object String]':
      return stringToFunction(obj);
    case '[object RegExp]':
      return regexpToFunction(obj);
    default:
      return defaultToFunction(obj);
  }
}

/**
 * Default to strict equality.
 *
 * @param {Mixed} val
 * @return {Function}
 * @api private
 */

function defaultToFunction(val) {
  return function(obj){
    return val === obj;
  }
}

/**
 * Convert `re` to a function.
 *
 * @param {RegExp} re
 * @return {Function}
 * @api private
 */

function regexpToFunction(re) {
  return function(obj){
    return re.test(obj);
  }
}

/**
 * Convert property `str` to a function.
 *
 * @param {String} str
 * @return {Function}
 * @api private
 */

function stringToFunction(str) {
  // immediate such as "> 20"
  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

  // properties such as "name.first" or "age > 18"
  return new Function('_', 'return _.' + str);
}

/**
 * Convert `object` to a function.
 *
 * @param {Object} object
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  var match = {}
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key])
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  }
}

});
require.register("component-each/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var toFunction = require('to-function');
var type;

try {
  type = require('type-component');
} catch (e) {
  type = require('type');
}

/**
 * HOP reference.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Iterate the given `obj` and invoke `fn(val, i)`.
 *
 * @param {String|Array|Object} obj
 * @param {Function} fn
 * @api public
 */

module.exports = function(obj, fn){
  fn = toFunction(fn);
  switch (type(obj)) {
    case 'array':
      return array(obj, fn);
    case 'object':
      if ('number' == typeof obj.length) return array(obj, fn);
      return object(obj, fn);
    case 'string':
      return string(obj, fn);
  }
};

/**
 * Iterate string chars.
 *
 * @param {String} obj
 * @param {Function} fn
 * @api private
 */

function string(obj, fn) {
  for (var i = 0; i < obj.length; ++i) {
    fn(obj.charAt(i), i);
  }
}

/**
 * Iterate object keys.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @api private
 */

function object(obj, fn) {
  for (var key in obj) {
    if (has.call(obj, key)) {
      fn(key, obj[key]);
    }
  }
}

/**
 * Iterate array-ish.
 *
 * @param {Array|Object} obj
 * @param {Function} fn
 * @api private
 */

function array(obj, fn) {
  for (var i = 0; i < obj.length; ++i) {
    fn(obj[i], i);
  }
}

});
require.register("component-event/index.js", function(exports, require, module){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture || false);
  } else {
    el.attachEvent('on' + type, fn);
  }
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture || false);
  } else {
    el.detachEvent('on' + type, fn);
  }
  return fn;
};

});
require.register("component-inherit/index.js", function(exports, require, module){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
});
require.register("component-object/index.js", function(exports, require, module){

/**
 * HOP ref.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Return own keys in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.keys = Object.keys || function(obj){
  var keys = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      keys.push(key);
    }
  }
  return keys;
};

/**
 * Return own values in `obj`.
 *
 * @param {Object} obj
 * @return {Array}
 * @api public
 */

exports.values = function(obj){
  var vals = [];
  for (var key in obj) {
    if (has.call(obj, key)) {
      vals.push(obj[key]);
    }
  }
  return vals;
};

/**
 * Merge `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api public
 */

exports.merge = function(a, b){
  for (var key in b) {
    if (has.call(b, key)) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * Return length of `obj`.
 *
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.length = function(obj){
  return exports.keys(obj).length;
};

/**
 * Check if `obj` is empty.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api public
 */

exports.isEmpty = function(obj){
  return 0 == exports.length(obj);
};
});
require.register("component-trim/index.js", function(exports, require, module){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

});
require.register("component-querystring/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var trim = require('trim');

/**
 * Parse the given query `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if ('string' != typeof str) return {};

  str = trim(str);
  if ('' == str) return {};

  var obj = {};
  var pairs = str.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var parts = pairs[i].split('=');
    obj[parts[0]] = null == parts[1]
      ? ''
      : decodeURIComponent(parts[1]);
  }

  return obj;
};

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

exports.stringify = function(obj){
  if (!obj) return '';
  var pairs = [];
  for (var key in obj) {
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return pairs.join('&');
};

});
require.register("component-type/index.js", function(exports, require, module){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

});
require.register("component-url/index.js", function(exports, require, module){

/**
 * Parse the given `url`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(url){
  var a = document.createElement('a');
  a.href = url;
  return {
    href: a.href,
    host: a.host || location.host,
    port: ('0' === a.port || '' === a.port) ? location.port : a.port,
    hash: a.hash,
    hostname: a.hostname || location.hostname,
    pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
    protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
    search: a.search,
    query: a.search.slice(1)
  };
};

/**
 * Check if `url` is absolute.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isAbsolute = function(url){
  return 0 == url.indexOf('//') || !!~url.indexOf('://');
};

/**
 * Check if `url` is relative.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isRelative = function(url){
  return !exports.isAbsolute(url);
};

/**
 * Check if `url` is cross domain.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isCrossDomain = function(url){
  url = exports.parse(url);
  return url.hostname !== location.hostname
    || url.port !== location.port
    || url.protocol !== location.protocol;
};
});
require.register("ianstormtaylor-callback/index.js", function(exports, require, module){
var next = require('next-tick');


/**
 * Expose `callback`.
 */

module.exports = callback;


/**
 * Call an `fn` back synchronously if it exists.
 *
 * @param {Function} fn
 */

function callback (fn) {
  if ('function' === typeof fn) fn();
}


/**
 * Call an `fn` back asynchronously if it exists. If `wait` is ommitted, the
 * `fn` will be called on next tick.
 *
 * @param {Function} fn
 * @param {Number} wait (optional)
 */

callback.async = function (fn, wait) {
  if ('function' !== typeof fn) return;
  if (!wait) return next(fn);
  setTimeout(fn, wait);
};


/**
 * Symmetry.
 */

callback.sync = callback;

});
require.register("ianstormtaylor-is/index.js", function(exports, require, module){

var typeOf = require('type');


/**
 * Types.
 */

var types = [
  'arguments',
  'array',
  'boolean',
  'date',
  'element',
  'function',
  'null',
  'number',
  'object',
  'regexp',
  'string',
  'undefined'
];


/**
 * Expose type checkers.
 *
 * @param {Mixed} value
 * @return {Boolean}
 */

for (var i = 0, type; type = types[i]; i++) exports[type] = generate(type);


/**
 * Generate a type checker.
 *
 * @param {String} type
 * @return {Function}
 */

function generate (type) {
  return function (value) {
    return type === typeOf(value);
  };
}
});
require.register("ianstormtaylor-map/index.js", function(exports, require, module){

var each = require('each');


/**
 * Map an array or object.
 *
 * @param {Array|Object} obj
 * @param {Function} iterator
 * @return {Mixed}
 */

module.exports = function map (obj, iterator) {
  var arr = [];
  each(obj, function (o) {
    arr.push(iterator.apply(null, arguments));
  });
  return arr;
};
});
require.register("segmentio-after/index.js", function(exports, require, module){

module.exports = function after (times, func) {
  // After 0, really?
  if (times <= 0) return func();

  // That's more like it.
  return function() {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
};
});
require.register("segmentio-alias/index.js", function(exports, require, module){

module.exports = function alias (object, aliases) {
    // For each of our aliases, rename our object's keys.
    for (var oldKey in aliases) {
        var newKey = aliases[oldKey];
        if (object[oldKey] !== undefined) {
            object[newKey] = object[oldKey];
            delete object[oldKey];
        }
    }
};
});
require.register("component-bind/index.js", function(exports, require, module){

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = [].slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

});
require.register("segmentio-bind-all/index.js", function(exports, require, module){

var bind   = require('bind')
  , type   = require('type');


module.exports = function (obj) {
  for (var key in obj) {
    var val = obj[key];
    if (type(val) === 'function') obj[key] = bind(obj, obj[key]);
  }
  return obj;
};
});
require.register("segmentio-canonical/index.js", function(exports, require, module){
module.exports = function canonical () {
  var tags = document.getElementsByTagName('link');
  for (var i = 0, tag; tag = tags[i]; i++) {
    if ('canonical' == tag.getAttribute('rel')) return tag.getAttribute('href');
  }
};
});
require.register("segmentio-extend/index.js", function(exports, require, module){

module.exports = function extend (object) {
    // Takes an unlimited number of extenders.
    var args = Array.prototype.slice.call(arguments, 1);

    // For each extender, copy their properties on our object.
    for (var i = 0, source; source = args[i]; i++) {
        if (!source) continue;
        for (var property in source) {
            object[property] = source[property];
        }
    }

    return object;
};
});
require.register("segmentio-is-email/index.js", function(exports, require, module){

/**
 * Expose `isEmail`.
 */

module.exports = isEmail;


/**
 * Email address matcher.
 */

var matcher = /.+\@.+\..+/;


/**
 * Loosely validate an email address.
 *
 * @param {String} string
 * @return {Boolean}
 */

function isEmail (string) {
  return matcher.test(string);
}
});
require.register("segmentio-is-meta/index.js", function(exports, require, module){
module.exports = function isMeta (e) {
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return true;

    // Logic that handles checks for the middle mouse button, based
    // on [jQuery](https://github.com/jquery/jquery/blob/master/src/event.js#L466).
    var which = e.which, button = e.button;
    if (!which && button !== undefined) {
      return (!button & 1) && (!button & 2) && (button & 4);
    } else if (which === 2) {
      return true;
    }

    return false;
};
});
require.register("component-json-fallback/index.js", function(exports, require, module){
/*
    json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON = {};

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

module.exports = JSON
});
require.register("segmentio-json/index.js", function(exports, require, module){

module.exports = 'undefined' == typeof JSON
  ? require('json-fallback')
  : JSON;

});
require.register("segmentio-load-date/index.js", function(exports, require, module){


/*
 * Load date.
 *
 * For reference: http://www.html5rocks.com/en/tutorials/webperformance/basics/
 */

var time = new Date()
  , perf = window.performance;

if (perf && perf.timing && perf.timing.responseEnd) {
  time = new Date(perf.timing.responseEnd);
}

module.exports = time;
});
require.register("segmentio-load-script/index.js", function(exports, require, module){
var type = require('type');


module.exports = function loadScript (options, callback) {
    if (!options) throw new Error('Cant load nothing...');

    // Allow for the simplest case, just passing a `src` string.
    if (type(options) === 'string') options = { src : options };

    var https = document.location.protocol === 'https:' ||
                document.location.protocol === 'chrome-extension:';

    // If you use protocol relative URLs, third-party scripts like Google
    // Analytics break when testing with `file:` so this fixes that.
    if (options.src && options.src.indexOf('//') === 0) {
        options.src = https ? 'https:' + options.src : 'http:' + options.src;
    }

    // Allow them to pass in different URLs depending on the protocol.
    if (https && options.https) options.src = options.https;
    else if (!https && options.http) options.src = options.http;

    // Make the `<script>` element and insert it before the first script on the
    // page, which is guaranteed to exist since this Javascript is running.
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = options.src;

    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);

    // If we have a callback, attach event handlers, even in IE. Based off of
    // the Third-Party Javascript script loading example:
    // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
    if (callback && type(callback) === 'function') {
        if (script.addEventListener) {
            script.addEventListener('load', callback, false);
        } else if (script.attachEvent) {
            script.attachEvent('onreadystatechange', function () {
                if (/complete|loaded/.test(script.readyState)) callback();
            });
        }
    }

    // Return the script element in case they want to do anything special, like
    // give it an ID or attributes.
    return script;
};

});
require.register("segmentio-type/index.js", function(exports, require, module){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

});
require.register("segmentio-new-date/index.js", function(exports, require, module){
var type = require('type');


/**
 * Returns a new Javascript Date object, allowing a variety of extra input types
 * over the native one.
 *
 * @param {Date|String|Number} input
 */

module.exports = function newDate (input) {

  // Convert input from seconds to milliseconds.
  input = toMilliseconds(input);

  // By default, delegate to Date, which will return `Invalid Date`s if wrong.
  var date = new Date(input);

  // If we have a string that the Date constructor couldn't parse, convert it.
  if (isNaN(date.getTime()) && 'string' === type(input)) {
    var milliseconds = toMilliseconds(parseInt(input, 10));
    date = new Date(milliseconds);
  }

  return date;
};


/**
 * If the number passed in is seconds from the epoch, turn it into milliseconds.
 * Milliseconds would be greater than 31557600000 (December 31, 1970).
 *
 * @param seconds
 */

function toMilliseconds (seconds) {
  if ('number' === type(seconds) && seconds < 31557600000) return seconds * 1000;
  return seconds;
}
});
require.register("segmentio-on-body/index.js", function(exports, require, module){
var each = require('each');


/**
 * Cache whether `<body>` exists.
 */

var body = false;


/**
 * Callbacks to call when the body exists.
 */

var callbacks = [];


/**
 * Export a way to add handlers to be invoked once the body exists.
 *
 * @param {Function} callback  A function to call when the body exists.
 */

module.exports = function onBody (callback) {
  if (body) {
    call(callback);
  } else {
    callbacks.push(callback);
  }
};


/**
 * Set an interval to check for `document.body`.
 */

var interval = setInterval(function () {
  if (!document.body) return;
  body = true;
  each(callbacks, call);
  clearInterval(interval);
}, 5);


/**
 * Call a callback, passing it the body.
 *
 * @param {Function} callback  The callback to call.
 */

function call (callback) {
  callback(document.body);
}
});
require.register("segmentio-store.js/store.js", function(exports, require, module){
var json             = require('json')
  , store            = {}
  , win              = window
	,	doc              = win.document
	,	localStorageName = 'localStorage'
	,	namespace        = '__storejs__'
	,	storage;

store.disabled = false
store.set = function(key, value) {}
store.get = function(key) {}
store.remove = function(key) {}
store.clear = function() {}
store.transact = function(key, defaultVal, transactionFn) {
	var val = store.get(key)
	if (transactionFn == null) {
		transactionFn = defaultVal
		defaultVal = null
	}
	if (typeof val == 'undefined') { val = defaultVal || {} }
	transactionFn(val)
	store.set(key, val)
}
store.getAll = function() {}

store.serialize = function(value) {
	return json.stringify(value)
}
store.deserialize = function(value) {
	if (typeof value != 'string') { return undefined }
	try { return json.parse(value) }
	catch(e) { return value || undefined }
}

// Functions to encapsulate questionable FireFox 3.6.13 behavior
// when about.config::dom.storage.enabled === false
// See https://github.com/marcuswestin/store.js/issues#issue/13
function isLocalStorageNameSupported() {
	try { return (localStorageName in win && win[localStorageName]) }
	catch(err) { return false }
}

if (isLocalStorageNameSupported()) {
	storage = win[localStorageName]
	store.set = function(key, val) {
		if (val === undefined) { return store.remove(key) }
		storage.setItem(key, store.serialize(val))
		return val
	}
	store.get = function(key) { return store.deserialize(storage.getItem(key)) }
	store.remove = function(key) { storage.removeItem(key) }
	store.clear = function() { storage.clear() }
	store.getAll = function() {
		var ret = {}
		for (var i=0; i<storage.length; ++i) {
			var key = storage.key(i)
			ret[key] = store.get(key)
		}
		return ret
	}
} else if (doc.documentElement.addBehavior) {
	var storageOwner,
		storageContainer
	// Since #userData storage applies only to specific paths, we need to
	// somehow link our data to a specific path.  We choose /favicon.ico
	// as a pretty safe option, since all browsers already make a request to
	// this URL anyway and being a 404 will not hurt us here.  We wrap an
	// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
	// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
	// since the iframe access rules appear to allow direct access and
	// manipulation of the document element, even for a 404 page.  This
	// document can be used instead of the current document (which would
	// have been limited to the current path) to perform #userData storage.
	try {
		storageContainer = new ActiveXObject('htmlfile')
		storageContainer.open()
		storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></iframe>')
		storageContainer.close()
		storageOwner = storageContainer.w.frames[0].document
		storage = storageOwner.createElement('div')
	} catch(e) {
		// somehow ActiveXObject instantiation failed (perhaps some special
		// security settings or otherwse), fall back to per-path storage
		storage = doc.createElement('div')
		storageOwner = doc.body
	}
	function withIEStorage(storeFunction) {
		return function() {
			var args = Array.prototype.slice.call(arguments, 0)
			args.unshift(storage)
			// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
			// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
			storageOwner.appendChild(storage)
			storage.addBehavior('#default#userData')
			storage.load(localStorageName)
			var result = storeFunction.apply(store, args)
			storageOwner.removeChild(storage)
			return result
		}
	}

	// In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40
	var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
	function ieKeyFix(key) {
		return key.replace(forbiddenCharsRegex, '___')
	}
	store.set = withIEStorage(function(storage, key, val) {
		key = ieKeyFix(key)
		if (val === undefined) { return store.remove(key) }
		storage.setAttribute(key, store.serialize(val))
		storage.save(localStorageName)
		return val
	})
	store.get = withIEStorage(function(storage, key) {
		key = ieKeyFix(key)
		return store.deserialize(storage.getAttribute(key))
	})
	store.remove = withIEStorage(function(storage, key) {
		key = ieKeyFix(key)
		storage.removeAttribute(key)
		storage.save(localStorageName)
	})
	store.clear = withIEStorage(function(storage) {
		var attributes = storage.XMLDocument.documentElement.attributes
		storage.load(localStorageName)
		for (var i=0, attr; attr=attributes[i]; i++) {
			storage.removeAttribute(attr.name)
		}
		storage.save(localStorageName)
	})
	store.getAll = withIEStorage(function(storage) {
		var attributes = storage.XMLDocument.documentElement.attributes
		var ret = {}
		for (var i=0, attr; attr=attributes[i]; ++i) {
			var key = ieKeyFix(attr.name)
			ret[attr.name] = store.deserialize(storage.getAttribute(key))
		}
		return ret
	})
}

try {
	store.set(namespace, namespace)
	if (store.get(namespace) != namespace) { store.disabled = true }
	store.remove(namespace)
} catch(e) {
	store.disabled = true
}
store.enabled = !store.disabled

module.exports = store;
});
require.register("segmentio-top-domain/index.js", function(exports, require, module){

var url = require('url');

// Official Grammar: http://tools.ietf.org/html/rfc883#page-56
// Look for tlds with up to 2-6 characters.

module.exports = function (urlStr) {

  var host     = url.parse(urlStr).hostname
    , topLevel = host.match(/[a-z0-9][a-z0-9\-]*[a-z0-9]\.[a-z\.]{2,6}$/i);

  return topLevel ? topLevel[0] : host;
};
});
require.register("timoxley-next-tick/index.js", function(exports, require, module){
"use strict"

if (typeof setImmediate == 'function') {
  module.exports = function(f){ setImmediate(f) }
}
// legacy node.js
else if (typeof process != 'undefined' && typeof process.nextTick == 'function') {
  module.exports = process.nextTick
}
// fallback for other environments / postMessage behaves badly on IE8
else if (typeof window == 'undefined' || window.ActiveXObject || !window.postMessage) {
  module.exports = function(f){ setTimeout(f) };
} else {
  var q = [];

  window.addEventListener('message', function(){
    var i = 0;
    while (i < q.length) {
      try { q[i++](); }
      catch (e) {
        q = q.slice(i);
        window.postMessage('tic!', '*');
        throw e;
      }
    }
    q.length = 0;
  }, true);

  module.exports = function(fn){
    if (!q.length) window.postMessage('tic!', '*');
    q.push(fn);
  }
}

});
require.register("yields-prevent/index.js", function(exports, require, module){

/**
 * prevent default on the given `e`.
 * 
 * examples:
 * 
 *      anchor.onclick = prevent;
 *      anchor.onclick = function(e){
 *        if (something) return prevent(e);
 *      };
 * 
 * @param {Event} e
 */

module.exports = function(e){
  e = e || window.event
  return e.preventDefault
    ? e.preventDefault()
    : e.returnValue = false;
};

});
require.register("analytics/lib/index.js", function(exports, require, module){
/**
 * Analytics.js
 *
 * (C) 2013 Segment.io Inc.
 */

var Analytics = require('./analytics');


/**
 * Expose an `analytics` singleton.
 */

module.exports = new Analytics();
});
require.register("analytics/lib/analytics.js", function(exports, require, module){

var after = require('after')
  , bind = require('event').bind
  , callback = require('callback')
  , clone = require('clone')
  , cookie = require('./cookie')
  , each = require('each')
  , is = require('is')
  , isEmail = require('is-email')
  , isMeta = require('is-meta')
  , localStore = require('./localStore')
  , map = require('map')
  , newDate = require('new-date')
  , size = require('object').length
  , prevent = require('prevent')
  , Provider = require('./provider')
  , Providers = require('./providers')
  , querystring = require('querystring')
  , user = require('./user');


/**
 * Expose `Analytics`.
 */

module.exports = exports = Analytics;


/**
 * Expose `VERSION`.
 */

exports.VERSION = '0.12.0';


/**
 * Expose `Providers`.
 */

exports.Providers = Providers;


/**
 * Expose the default `Provider`.
 */

exports.Provider = Provider;


/**
 * Define a new `Provider`.
 *
 * @param {Function} Provider
 * @return {Analytics}
 */

exports.provider = function (Provider) {
  var name = Provider.prototype.name;
  Providers[name] = Provider;
  return this;
};


/**
 * Initialize a new `Analytics` instance.
 */

function Analytics () {
  this._callbacks = [];
  this._providers = [];
  this._readied = false;
  this._timeout = 300;
  this._user = user;
}


/**
 * Initialize with the given provider `settings` and `options`. Aliased to
 * `init` for convenience.
 *
 * @param {Object} settings
 * @param {Object} options
 * @return {Analytics}
 */

Analytics.prototype.init =
Analytics.prototype.initialize = function (settings, options) {
  this._options(options);
  this._readied = false;
  this._providers = [];

  // load user now that options are set
  this._user.load();

  // make ready callback
  var self = this;
  var ready = after(size(settings), function () {
    self._readied = true;
    var callback;
    while (callback = self._callbacks.shift()) callback();
  });

  // initialize providers, passing ready
  each(settings, function (name, options) {
    var Provider = self.Providers[name];
    if (!Provider) return self;
    var provider = new Provider(options, ready, self);
    self._providers.push(provider);
  });

  // call any querystring methods if present
  this._parseQuery();
  return this;
};


/**
 * Identify a user by optional `id` and `traits`.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 * @param {Function} fn (optional)
 * @return {Analytics}
 */

Analytics.prototype.identify = function (id, traits, options, fn) {
  if (is.function(options)) fn = options, options = undefined;
  if (is.function(traits)) fn = traits, traits = undefined;
  if (is.object(id)) traits = id, id = user.id();

  this._user.update(id, traits);

  // clone traits before we manipulate so we don't do anything uncouth, and take
  // from `user` so that we carryover anonymous traits
  traits = cleanTraits(id, clone(user.traits()));

  this._invoke('identify', id, traits, options);
  this._callback(fn);
  return this;
};


/**
 * Return the current user.
 *
 * @return {Object}
 */

Analytics.prototype.user = function () {
  return this._user;
};


/**
 * Identify a group by optional `id` and `properties`. Or, if no arguments are
 * supplied, return the current group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 * @param {Function} fn (optional)
 * @return {Analytics|Object}
 */

Analytics.prototype.group = function (id, properties, options, fn) {
  if (is.function(options)) fn = options, options = undefined;
  if (is.function(properties)) fn = properties, properties = undefined;

  properties = clone(properties) || {};
  if (properties.created) properties.created = newDate(properties.created);

  this._invoke('group', id, properties, options);
  this._callback(fn);
  return this;
};


/**
 * Track an `event` that a user has triggered with optional `properties`.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 * @param {Function} fn (optional)
 * @return {Analytics}
 */

Analytics.prototype.track = function (event, properties, options, fn) {
  if (is.function(options)) fn = options, options = undefined;
  if (is.function(properties)) fn = properties, properties = undefined;

  properties = clone(properties) || {};

  this._invoke('track', event, properties, options);
  this._callback(fn);
  return this;
};


/**
 * Helper method to track an outbound link that would normally navigate away
 * from the page before the analytics calls were sent.
 *
 * BACKWARDS COMPATIBILITY: aliased to `trackClick`.
 *
 * @param {Element|Array} links
 * @param {String|Function} event
 * @param {Object|Function} properties (optional)
 * @return {Analytics}
 */

Analytics.prototype.trackClick =
Analytics.prototype.trackLink = function (links, event, properties) {
  if (!links) return this;
  if (is.element(links)) links = [links]; // always arrays, handles jquery

  var self = this;
  each(links, function (el) {
    bind(el, 'click', function (e) {
      var ev = is.function(event) ? event(el) : event;
      var props = is.function(properties) ? properties(el) : properties;
      self.track(ev, props);

      if (el.href && el.target !== '_blank' && !isMeta(e)) {
        prevent(e);
        self._callback(function () {
          window.location.href = el.href;
        });
      }
    });
  });

  return this;
};


/**
 * Helper method to track an outbound form that would normally navigate away
 * from the page before the analytics calls were sent.
 *
 * BACKWARDS COMPATIBILITY: aliased to `trackSubmit`.
 *
 * @param {Element|Array} forms
 * @param {String|Function} event
 * @param {Object|Function} properties (optional)
 * @return {Analytics}
 */

Analytics.prototype.trackSubmit =
Analytics.prototype.trackForm = function (forms, event, properties) {
  if (!forms) return this;
  if (is.element(forms)) forms = [forms]; // always arrays, handles jquery

  var self = this;
  each(forms, function (el) {
    function handler (e) {
      prevent(e);

      var ev = is.function(event) ? event(el) : event;
      var props = is.function(properties) ? properties(el) : properties;
      self.track(ev, props);

      self._callback(function () {
        el.submit();
      });
    }

    // support the events happening through jQuery or Zepto instead of through
    // the normal DOM API, since `el.submit` doesn't bubble up events...
    var $ = window.jQuery || window.Zepto;
    if ($) {
      $(el).submit(handler);
    } else {
      bind(el, 'submit', handler);
    }
  });

  return this;
};


/**
 * Manually trigger a pageview, useful for single-page apps.
 *
 * @param {String} url (optional)
 * @param {Object} options (optional)
 * @return {Analytics}
 */

Analytics.prototype.pageview = function (url, options) {
  this._invoke('pageview', url, options);
  return this;
};


/**
 * Merge two previously unassociated user identities.
 *
 * @param {String} newId
 * @param {String} oldId
 * @param {Object} options
 * @return {Analytics}
 */

Analytics.prototype.alias = function (newId, oldId, options) {
  if (is.object(oldId)) options = oldId, oldId = undefined;

  this._invoke('alias', newId, oldId, options);
  return this;
};


/**
 * Register a `fn` to be fired when all the analytics services are ready.
 *
 * @param {Function} fn
 * @return {Analytics}
 */

Analytics.prototype.ready = function (fn) {
  if (!is.function(fn)) return this;
  this._readied
    ? callback.async(fn)
    : this._callbacks.push(fn);
  return this;
};


/**
 * Apply options.
 *
 * @param {Object} options
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._options = function (options) {
  options || (options = {});
  cookie.options(options.cookie);
  localStore.options(options.localStorage);
  user.options(options.user);
  return this;
};


/**
 * Callback a `fn` after our defined timeout period.
 *
 * @param {Function} fn
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._callback = function (fn) {
  callback.async(fn, this._timeout);
  return this;
};


/**
 * Call a `method` on all of initialized providers, passing clones of arguments
 * along to keep each provider isolated.
 *
 * TODO: check provider enabled
 *
 * @param {String} method
 * @param {Mixed} args...
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._invoke = function (method, args) {
  args = [].slice.call(arguments, 1);
  var options = args[args.length-1];
  each(this._providers, function (provider) {
    if (!provider[method] || !isEnabled(provider, options)) return;
    var cloned = map(args, clone);
    provider.ready
      ? provider[method].apply(provider, cloned)
      : provider.enqueue(method, cloned);
  });
  return this;
};


/**
 * Parse the query string for callable methods.
 *
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._parseQuery = function () {
  // Identify and track any `ajs_uid` and `ajs_event` parameters in the URL.
  var q = querystring.parse(window.location.search);
  if (q.ajs_uid) this.identify(q.ajs_uid);
  if (q.ajs_event) this.track(q.ajs_event);
  return this;
};


/**
 * Attach exports to prototype, so they are always available to the end user.
 */

Analytics.prototype.VERSION = exports.VERSION;
Analytics.prototype.Providers = exports.Providers;
Analytics.prototype.Provider = exports.Provider;
Analytics.prototype.provider = exports.provider;


/**
 * Determine whether a `provider` is enabled or not based on `options`.
 *
 * @param {Object} provider
 * @param {Object} options
 * @return {Boolean} - wether the provider is enabled.
 */

function isEnabled (provider, options) {
  var enabled = true;
  if (!options || !options.providers) return enabled;

  // Default to the 'all' or 'All' setting.
  var map = options.providers;
  if (map.all !== undefined) enabled = map.all;
  if (map.All !== undefined) enabled = map.All;

  // Look for this provider's specific setting.
  var name = provider.name;
  if (map[name] !== undefined) enabled = map[name];

  return enabled;
}


/**
 * Clean up traits, default some useful things both so the user doesn't have to
 * and so we don't have to do it on a provider-basis.
 *
 * @param {Object} traits
 * @return {Object}
 */

function cleanTraits (userId, traits) {
  // Add the `email` trait if it doesn't exist and the `userId` is an email.
  if (!traits.email && isEmail(userId)) traits.email = userId;

  // Create the `name` trait if it doesn't exist and `firstName` and `lastName`
  // are both supplied.
  if (!traits.name && traits.firstName && traits.lastName) {
    traits.name = traits.firstName + ' ' + traits.lastName;
  }

  // Convert dates from more types of input into Date objects.
  if (traits.created) traits.created = newDate(traits.created);
  if (traits.company && traits.company.created) {
    traits.company.created = newDate(traits.company.created);
  }

  return traits;
}
});
require.register("analytics/lib/cookie.js", function(exports, require, module){

var bindAll   = require('bind-all')
  , cookie    = require('cookie')
  , clone     = require('clone')
  , defaults  = require('defaults')
  , json      = require('json')
  , topDomain = require('top-domain');


function Cookie (options) {
  this.options(options);
}

/**
 * Get or set the cookie options
 *
 * @param  {Object} options
 *   @field {Number}  maxage (1 year)
 *   @field {String}  domain
 *   @field {String}  path
 *   @field {Boolean} secure
 */

Cookie.prototype.options = function (options) {
  if (arguments.length === 0) return this._options;

  options || (options = {});

  var domain = '.' + topDomain(window.location.href);

  // localhost cookies are special: http://curl.haxx.se/rfc/cookie_spec.html
  if (domain === '.localhost') domain = '';

  defaults(options, {
    maxage  : 31536000000, // default to a year
    path    : '/',
    domain  : domain
  });

  this._options = options;
};


/**
 * Set a value in our cookie
 *
 * @param  {String} key
 * @param  {Object} value
 * @return {Boolean} saved
 */

Cookie.prototype.set = function (key, value) {
  try {
    value = json.stringify(value);
    cookie(key, value, clone(this._options));
    return true;
  } catch (e) {
    return false;
  }
};


/**
 * Get a value from our cookie
 * @param  {String} key
 * @return {Object} value
 */

Cookie.prototype.get = function (key) {
  try {
    var value = cookie(key);
    value = value ? json.parse(value) : null;
    return value;
  } catch (e) {
    return null;
  }
};


/**
 * Remove a value from the cookie
 *
 * @param  {String}  key
 * @return {Boolean} removed
 */

Cookie.prototype.remove = function (key) {
  try {
    cookie(key, null, clone(this._options));
    return true;
  } catch (e) {
    return false;
  }
};


/**
 * Export singleton cookie
 */

module.exports = bindAll(new Cookie());


module.exports.Cookie = Cookie;

});
require.register("analytics/lib/localStore.js", function(exports, require, module){

var bindAll  = require('bind-all')
  , defaults = require('defaults')
  , store    = require('store');


function Store (options) {
  this.options(options);
}


/**
 * Sets the options for the store
 *
 * @param  {Object} options
 *   @field {Boolean} enabled (true)
 */

Store.prototype.options = function (options) {
  if (arguments.length === 0) return this._options;

  options || (options = {});
  defaults(options, { enabled : true });

  this.enabled  = options.enabled && store.enabled;
  this._options = options;
};


/**
 * Sets a value in local storage
 *
 * @param  {String} key
 * @param  {Object} value
 */

Store.prototype.set = function (key, value) {
  if (!this.enabled) return false;
  return store.set(key, value);
};


/**
 * Gets a value from local storage
 *
 * @param  {String} key
 * @return {Object}
 */

Store.prototype.get = function (key) {
  if (!this.enabled) return null;
  return store.get(key);
};


/**
 * Removes a value from local storage
 *
 * @param  {String} key
 */

Store.prototype.remove = function (key) {
  if (!this.enabled) return false;
  return store.remove(key);
};


/**
 * Singleton exports
 */

module.exports = bindAll(new Store());
});
require.register("analytics/lib/integration.js", function(exports, require, module){

var inherit = require('inherit')
  , Provider = require('./provider');


/**
 * Expose `createIntegration`.
 */

module.exports = createIntegration;


/**
 * Create a new Integration constructor.
 *
 * TODO: make this not inherit but actually create
 */

function createIntegration (name) {

  function Integration () {
    Provider.apply(this, arguments);
  }

  inherit(Integration, Provider);
  Integration.prototype.name = name;
  return Integration;
}
});
require.register("analytics/lib/provider.js", function(exports, require, module){
var each   = require('each')
  , extend = require('extend')
  , type   = require('type');


module.exports = Provider;


/**
 * Provider
 *
 * @param {Object} options - settings to initialize the Provider with. This will
 * be merged with the Provider's own defaults.
 *
 * @param {Function} ready - a ready callback, to be called when the provider is
 * ready to handle analytics calls.
 */

function Provider (options, ready, analytics) {
  var self = this;

  // Store the reference to the global `analytics` object.
  this.analytics = analytics;

  // Make a queue of `{ method : 'identify', args : [] }` to unload once ready.
  this.queue = [];
  this.ready = false;

  // Allow for `options` to only be a string if the provider has specified
  // a default `key`, in which case convert `options` into a dictionary. Also
  // allow for it to be `true`, like in Optimizely's case where there is no need
  // for any default key.
  if (type(options) !== 'object') {
    if (options === true) {
      options = {};
    } else if (this.key) {
      var key = options;
      options = {};
      options[this.key] = key;
    } else {
      throw new Error('Couldnt resolve options.');
    }
  }

  // Extend the passed-in options with our defaults.
  this.options = extend({}, this.defaults, options);

  // Wrap our ready function, so that it ready from our internal queue first
  // and then marks us as ready.
  var dequeue = function () {
    each(self.queue, function (call) {
      var method = call.method
        , args   = call.args;
      self[method].apply(self, args);
    });
    self.ready = true;
    self.queue = [];
    ready();
  };

  // Call our initialize method.
  this.initialize.call(this, this.options, dequeue);
}


/**
 * Inheritance helper.
 *
 * Modeled after Backbone's `extend` method:
 * https://github.com/documentcloud/backbone/blob/master/backbone.js#L1464
 */

Provider.extend = function (properties) {
  var parent = this;
  var child = function () { return parent.apply(this, arguments); };
  var Surrogate = function () { this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();
  extend(child.prototype, properties);
  return child;
};


/**
 * Augment Provider's prototype.
 */

extend(Provider.prototype, {

  /**
   * Default settings for the provider.
   */

  options : {},


  /**
   * The single required API key for the provider. This lets us support a terse
   * initialization syntax:
   *
   *     analytics.initialize({
   *       'Provider' : 'XXXXXXX'
   *     });
   *
   * Only add this if the provider has a _single_ required key.
   */

  key : undefined,


  /**
   * Initialize our provider.
   *
   * @param {Object} options - the settings for the provider.
   * @param {Function} ready - a ready callback to call when we're ready to
   * start accept analytics method calls.
   */
  initialize : function (options, ready) {
    ready();
  },


  /**
   * Adds an item to the our internal pre-ready queue.
   *
   * @param {String} method - the analytics method to call (eg. 'track').
   * @param {Object} args - the arguments to pass to the method.
   */
  enqueue : function (method, args) {
    this.queue.push({
      method : method,
      args : args
    });
  }

});
});
require.register("analytics/lib/user.js", function(exports, require, module){
var bindAll    = require('bind-all')
  , clone      = require('clone')
  , cookie     = require('./cookie')
  , defaults   = require('defaults')
  , extend     = require('extend')
  , localStore = require('./localStore');


function User (options) {
  this._id     = null;
  this._traits = {};
  this.options(options);
}


/**
 * Sets the options for the user
 *
 * @param  {Object} options
 *   @field {Object}  cookie
 *   @field {Object}  localStorage
 *   @field {Boolean} persist (true)
 */

User.prototype.options = function (options) {
  options || (options = {});

  defaults(options, {
    persist : true
  });

  this.cookie(options.cookie);
  this.localStorage(options.localStorage);
  this.persist = options.persist;
};


/**
 * Get or set cookie options
 *
 * @param  {Object} options
 */

User.prototype.cookie = function (options) {
  if (arguments.length === 0) return this.cookieOptions;

  options || (options = {});
  defaults(options, {
    key    : 'ajs_user_id',
    oldKey : 'ajs_user'
  });
  this.cookieOptions = options;
};


/**
 * Get or set local storage options
 *
 * @param  {Object} options
 */

User.prototype.localStorage = function (options) {
  if (arguments.length === 0) return this.localStorageOptions;

  options || (options = {});
  defaults(options, {
    key    : 'ajs_user_traits'
  });
  this.localStorageOptions = options;
};


/**
 * Get or set the user id
 *
 * @param  {String} id
 */

User.prototype.id = function (id) {
  if (arguments.length === 0) return this._id;
  this._id = id;
};


/**
 * Get or set the user traits
 *
 * @param  {Object} traits
 */

User.prototype.traits = function (traits) {
  if (arguments.length === 0) return clone(this._traits);
  traits || (traits = {});

  this._traits = traits;
};


/**
 * Updates the current stored user with id and traits.
 *
 * @param {String} userId - the new user ID.
 * @param {Object} traits - any new traits.
 * @return {Boolean} whether alias should be called.
 */

User.prototype.update = function (userId, traits) {

  // Make an alias call if there was no previous userId, there is one
  // now, and we are using a cookie between page loads.
  var alias = !this.id() && userId && this.persist;

  traits || (traits = {});

  // If there is a current user and the new user isn't the same,
  // we want to just replace their traits. Otherwise extend.
  if (this.id() && userId && this.id() !== userId) this.traits(traits);
  else this.traits(extend(this.traits(), traits));

  if (userId) this.id(userId);

  this.save();

  return alias;
};


/**
 * Save the user to localstorage and cookie
 *
 * @return {Boolean} saved
 */

User.prototype.save = function () {
  if (!this.persist) return false;

  cookie.set(this.cookie().key, this.id());
  localStore.set(this.localStorage().key, this.traits());
  return true;
};


/**
 * Loads a saved user, and set its information
 *
 * @return {Object} user
 */

User.prototype.load = function () {
  if (this.loadOldCookie()) return this.toJSON();

  var id     = cookie.get(this.cookie().key)
    , traits = localStore.get(this.localStorage().key);

  this.id(id);
  this.traits(traits);
  return this.toJSON();
};


/**
 * Clears the user, and removes the stored version
 *
 */

User.prototype.clear = function () {
  cookie.remove(this.cookie().key);
  localStore.remove(this.localStorage().key);
  this.id(null);
  this.traits({});
};


/**
 * Load the old user from the cookie. Should be phased
 * out at some point
 *
 * @return {Boolean} loaded
 */

User.prototype.loadOldCookie = function () {
  var user = cookie.get(this.cookie().oldKey);
  if (!user) return false;

  this.id(user.id);
  this.traits(user.traits);
  cookie.remove(this.cookie().oldKey);
  return true;
};


/**
 * Get the user info
 *
 * @return {Object}
 */

User.prototype.toJSON = function () {
  return {
    id     : this.id(),
    traits : this.traits()
  };
};


/**
 * Export the new user as a singleton.
 */

module.exports = bindAll(new User());

});
require.register("analytics/lib/utils.js", function(exports, require, module){
// A helper to track events based on the 'anjs' url parameter
exports.getUrlParameter = function (urlSearchParameter, paramKey) {
  var params = urlSearchParameter.replace('?', '').split('&');
  for (var i = 0; i < params.length; i += 1) {
    var param = params[i].split('=');
    if (param.length === 2 && param[0] === paramKey) {
      return decodeURIComponent(param[1]);
    }
  }
};
});
require.register("analytics/lib/providers/adroll.js", function(exports, require, module){
// https://www.adroll.com/dashboard

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'AdRoll',

  defaults : {
    // Adroll requires two options: `advId` and `pixId`.
    advId : null,
    pixId : null
  },

  initialize : function (options, ready) {
    window.adroll_adv_id = options.advId;
    window.adroll_pix_id = options.pixId;
    window.__adroll_loaded = true;

    load({
      http  : 'http://a.adroll.com/j/roundtrip.js',
      https : 'https://s.adroll.com/j/roundtrip.js'
    }, ready);
  }

});
});
require.register("analytics/lib/providers/amplitude.js", function(exports, require, module){
// https://github.com/amplitude/Amplitude-Javascript

var Provider = require('../provider')
  , alias    = require('alias')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Amplitude',

  key : 'apiKey',

  defaults : {
    // Amplitude's required API key.
    apiKey : null,
    // Whether to track pageviews to Amplitude.
    pageview : false
  },

  initialize : function (options, ready) {
    // Create the Amplitude global and queuer methods.
    (function(e,t){var r=e.amplitude||{};
    r._q=[];function i(e){r[e]=function(){r._q.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
    var s=["init","logEvent","setUserId","setGlobalUserProperties","setVersionName"];
    for(var c=0;c<s.length;c++){i(s[c])}e.amplitude=r})(window,document);

    // Load the Amplitude script and initialize with the API key.
    load('https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-1.0-min.js');
    window.amplitude.init(options.apiKey);

    // Amplitude creates a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    if (userId) window.amplitude.setUserId(userId);
    if (traits) window.amplitude.setGlobalUserProperties(traits);
  },

  track : function (event, properties) {
    window.amplitude.logEvent(event, properties);
  },

  pageview : function (url) {
    if (!this.options.pageview) return;

    var properties = {
      url  : url || document.location.href,
      name : document.title
    };

    this.track('Loaded a Page', properties);
  }

});
});
require.register("analytics/lib/providers/bugherd.js", function(exports, require, module){
// http://support.bugherd.com/home

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'BugHerd',

  key : 'apiKey',

  defaults : {
    apiKey : null,
    // Optionally hide the feedback tab if you want to build your own.
    // http://support.bugherd.com/entries/21497629-Create-your-own-Send-Feedback-tab
    showFeedbackTab : true
  },

  initialize : function (options, ready) {
    if (!options.showFeedbackTab) {
        window.BugHerdConfig = { "feedback" : { "hide" : true } };
    }
    load('//www.bugherd.com/sidebarv2.js?apikey=' + options.apiKey, ready);
  }

});
});
require.register("analytics/lib/providers/chartbeat.js", function(exports, require, module){
// http://chartbeat.com/docs/adding_the_code/
// http://chartbeat.com/docs/configuration_variables/
// http://chartbeat.com/docs/handling_virtual_page_changes/

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Chartbeat',

  defaults : {
    // Chartbeat requires two options: `domain` and `uid`. All other
    // configuration options are passed straight in!
    domain : null,
    uid    : null
  },


  initialize : function (options, ready) {
    // Since all the custom options just get passed through, update the
    // Chartbeat `_sf_async_config` variable with options.
    window._sf_async_config = options;

    // Chartbeat's javascript should only load after the body
    // is available, see https://github.com/segmentio/analytics.js/issues/107
    var loadChartbeat = function () {
      // We loop until the body is available.
      if (!document.body) return setTimeout(loadChartbeat, 5);

      // Use the stored date from when chartbeat was loaded.
      window._sf_endpt = (new Date()).getTime();

      // Load the Chartbeat javascript.
      load({
        https : 'https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/js/chartbeat.js',
        http  : 'http://static.chartbeat.com/js/chartbeat.js'
      }, ready);
    };
    loadChartbeat();
  },


  pageview : function (url) {
    // In case the Chartbeat library hasn't loaded yet.
    if (!window.pSUPERFLY) return;

    // Requires a path, so default to the current one.
    window.pSUPERFLY.virtualPage(url || window.location.pathname);
  }

});
});
require.register("analytics/lib/providers/clicktale.js", function(exports, require, module){
// http://wiki.clicktale.com/Article/JavaScript_API

var date     = require('load-date')
  , Provider = require('../provider')
  , load     = require('load-script')
  , onBody   = require('on-body');

module.exports = Provider.extend({

  name : 'ClickTale',

  key : 'projectId',

  defaults : {

    // If you sign up for a free account, this is the default http (non-ssl) CDN URL
    // that you get. If you sign up for a premium account, you get a different
    // custom CDN URL, so we have to leave it as an option.
    httpCdnUrl     : 'http://s.clicktale.net/WRe0.js',

    // SSL support is only for premium accounts. Each premium account seems to have
    // a different custom secure CDN URL, so we have to leave it as an option.
    httpsCdnUrl    : null,

    // The Project ID is loaded in after the ClickTale CDN javascript has loaded.
    projectId      : null,

    // The recording ratio specifies what fraction of people to screen-record.
    // ClickTale has a special calculator in their setup flow that tells you
    // what number to set for this.
    recordingRatio : 0.01,

    // The Partition ID determines where ClickTale stores the data according to
    // http://wiki.clicktale.com/Article/JavaScript_API
    partitionId    : null
  },


  initialize : function (options, ready) {
    // If we're on https:// but don't have a secure library, return early.
    if (document.location.protocol === 'https:' && !options.httpsCdnUrl) return;

    // ClickTale wants this at the "top" of the page. The analytics.js snippet
    // sets this date synchronously now, and makes it available via load-date.
    window.WRInitTime = date.getTime();

    // Add the required ClickTale div to the body.
    onBody(function (body) {
      var div = document.createElement('div');
      div.setAttribute('id', 'ClickTaleDiv');
      div.setAttribute('style', 'display: none;');
      body.appendChild(div);
    });

    var onloaded = function () {
      window.ClickTale(
        options.projectId,
        options.recordingRatio,
        options.partitionId
      );
      ready();
    };

    // If no SSL library is provided and we're on SSL then we can't load
    // anything (always true for non-premium accounts).
    load({
      http  : options.httpCdnUrl,
      https : options.httpsCdnUrl
    }, onloaded);
  },

  identify : function (userId, traits) {
    // We set the userId as the ClickTale UID.
    if (window.ClickTaleSetUID) window.ClickTaleSetUID(userId);

    // We iterate over all the traits and set them as key-value field pairs.
    if (window.ClickTaleField) {
      for (var traitKey in traits) {
        window.ClickTaleField(traitKey, traits[traitKey]);
      }
    }
  },

  track : function (event, properties) {
    // ClickTaleEvent is an alias for ClickTaleTag
    if (window.ClickTaleEvent) window.ClickTaleEvent(event);
  }

});
});
require.register("analytics/lib/providers/clicky.js", function(exports, require, module){
// http://clicky.com/help/customization/manual?new-domain
// http://clicky.com/help/customization/manual?new-domain#/help/customization#session

var Provider = require('../provider')
  , user     = require('../user')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Clicky',

  key : 'siteId',

  defaults : {
    siteId : null
  },

  initialize : function (options, ready) {
    window.clicky_site_ids = window.clicky_site_ids || [];
    window.clicky_site_ids.push(options.siteId);

    var userId  = user.id()
      , traits  = user.traits()
      , session = {};

    if (userId) session.id = userId;
    extend(session, traits);

    window.clicky_custom = { session : session };

    load('//static.getclicky.com/js', ready);
  },

  track : function (event, properties) {
    window.clicky.log(window.location.href, event);
  }

});
});
require.register("analytics/lib/providers/comscore.js", function(exports, require, module){
// http://direct.comscore.com/clients/help/FAQ.aspx#faqTagging

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'comScore',

  key : 'c2',

  defaults : {
    c1 : '2',
    c2 : null
  },

  // Pass the entire options object directly into comScore.
  initialize : function (options, ready) {
    window._comscore = window._comscore || [];
    window._comscore.push(options);
    load({
      http  : 'http://b.scorecardresearch.com/beacon.js',
      https : 'https://sb.scorecardresearch.com/beacon.js'
    }, ready);
  }

});
});
require.register("analytics/lib/providers/crazyegg.js", function(exports, require, module){
var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'CrazyEgg',

  key : 'accountNumber',

  defaults : {
    accountNumber : null
  },

  initialize : function (options, ready) {
    var accountPath = options.accountNumber.slice(0,4) + '/' + options.accountNumber.slice(4);
    load('//dnn506yrbagrg.cloudfront.net/pages/scripts/'+accountPath+'.js?'+Math.floor(new Date().getTime()/3600000), ready);
  }

});
});
require.register("analytics/lib/providers/customerio.js", function(exports, require, module){
// http://customer.io/docs/api/javascript.html

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Customer.io',

  key : 'siteId',

  defaults : {
    siteId : null
  },

  initialize : function (options, ready) {
    var _cio = window._cio = window._cio || [];
    (function() {
      var a,b,c;
      a = function (f) {
        return function () {
          _cio.push([f].concat(Array.prototype.slice.call(arguments,0)));
        };
      };
      b = ['identify', 'track'];
      for (c = 0; c < b.length; c++) {
        _cio[b[c]] = a(b[c]);
      }
    })();

    // Load the Customer.io script and add the required `id` and `data-site-id`.
    var script = load('https://assets.customer.io/assets/track.js');
    script.id = 'cio-tracker';
    script.setAttribute('data-site-id', options.siteId);

    // Since Customer.io creates their required methods in their snippet, we
    // don't need to wait to be ready.
    ready();
  },

  identify : function (userId, traits) {
    // Don't do anything if we just have traits, because Customer.io
    // requires a `userId`.
    if (!userId) return;

    // Customer.io takes the `userId` as part of the traits object.
    traits.id = userId;

    // Swap the `created` trait to the `created_at` that Customer.io needs
    // and convert it from milliseconds to seconds.
    if (traits.created) {
      traits.created_at = Math.floor(traits.created/1000);
      delete traits.created;
    }

    window._cio.identify(traits);
  },

  track : function (event, properties) {
    window._cio.track(event, properties);
  }

});
});
require.register("analytics/lib/providers/errorception.js", function(exports, require, module){
// http://errorception.com/

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script')
  , type     = require('type');


module.exports = Provider.extend({

  name : 'Errorception',

  key : 'projectId',

  defaults : {
    projectId : null,
    // Whether to store metadata about the user on `identify` calls, using
    // the [Errorception `meta` API](http://blog.errorception.com/2012/11/capture-custom-data-with-your-errors.html).
    meta : true
  },

  initialize : function (options, ready) {
    window._errs = window._errs || [options.projectId];
    load('//d15qhc0lu1ghnk.cloudfront.net/beacon.js');

    // Attach the window `onerror` event.
    var oldOnError = window.onerror;
    window.onerror = function () {
      window._errs.push(arguments);
      // Chain the old onerror handler after we finish our work.
      if ('function' === type(oldOnError)) {
        oldOnError.apply(this, arguments);
      }
    };

    // Errorception makes a queue, so it's ready immediately.
    ready();
  },

  // Add the traits to the Errorception meta object.
  identify : function (userId, traits) {
    if (!this.options.meta) return;

    // If the custom metadata object hasn't ever been made, make it.
    window._errs.meta || (window._errs.meta = {});

    // Add `userId` to traits.
    traits.id = userId;

    // Add all of the traits as metadata.
    extend(window._errs.meta, traits);
  }

});
});
require.register("analytics/lib/providers/foxmetrics.js", function(exports, require, module){
// http://foxmetrics.com/documentation/apijavascript

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'FoxMetrics',

  key : 'appId',

  defaults : {
    appId : null
  },

  initialize : function (options, ready) {
    var _fxm = window._fxm || {};
    window._fxm = _fxm.events || [];
    load('//d35tca7vmefkrc.cloudfront.net/scripts/' + options.appId + '.js');

    // FoxMetrics makes a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    // A `userId` is required for profile updates.
    if (!userId) return;

    // FoxMetrics needs the first and last name seperately. Fallback to
    // splitting the `name` trait if we don't have what we need.
    var firstName = traits.firstName
      , lastName  = traits.lastName;

    if (!firstName && traits.name) firstName = traits.name.split(' ')[0];
    if (!lastName && traits.name)  lastName  = traits.name.split(' ')[1];

    window._fxm.push([
      '_fxm.visitor.profile',
      userId,         // user id
      firstName,      // first name
      lastName,       // last name
      traits.email,   // email
      traits.address, // address
      undefined,      // social
      undefined,      // partners
      traits          // attributes
    ]);
  },

  track : function (event, properties) {
    window._fxm.push([
      event,               // event name
      properties.category, // category
      properties           // properties
    ]);
  },

  pageview : function (url) {
    window._fxm.push([
      '_fxm.pages.view',
      undefined, // title
      undefined, // name
      undefined, // category
      url,       // url
      undefined  // referrer
    ]);
  }

});
});
require.register("analytics/lib/providers/gauges.js", function(exports, require, module){
// http://get.gaug.es/documentation/tracking/

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Gauges',

  key : 'siteId',

  defaults : {
    siteId : null
  },

  initialize : function (options, ready) {
    window._gauges = window._gauges || [];
    var script = load('//secure.gaug.es/track.js');
    // Gauges needs a few attributes on its script element.
    script.id = 'gauges-tracker';
    script.setAttribute('data-site-id', options.siteId);

    // Gauges make a queue so it's ready immediately.
    ready();
  },

  pageview : function (url) {
    window._gauges.push(['track']);
  }

});
});
require.register("analytics/lib/providers/get-satisfaction.js", function(exports, require, module){
// You have to be signed in to access the snippet code:
// https://console.getsatisfaction.com/start/101022?signup=true#engage

var Provider = require('../provider')
  , load     = require('load-script')
  , onBody   = require('on-body');


module.exports = Provider.extend({

  name : 'Get Satisfaction',

  key : 'widgetId',

  defaults : {
    widgetId : null
  },

  initialize : function (options, ready) {
    // Get Satisfaction requires a div that will become their widget tab. Append
    // it once `document.body` exists.
    var div = document.createElement('div');
    var id = div.id = 'getsat-widget-' + options.widgetId;
    onBody(function (body) {
      body.appendChild(div);
    });

    // Usually they load their snippet synchronously, so we need to wait for it
    // to come back before initializing the tab.
    load('https://loader.engage.gsfn.us/loader.js', function () {
      if (window.GSFN !== undefined) {
        window.GSFN.loadWidget(options.widgetId, { containerId : id });
      }
      ready();
    });

  }

});
});
require.register("analytics/lib/providers/google-analytics.js", function(exports, require, module){
// https://developers.google.com/analytics/devguides/collection/gajs/

var Provider  = require('../provider')
  , load      = require('load-script')
  , type      = require('type')
  , url       = require('url')
  , canonical = require('canonical');


module.exports = Provider.extend({

  name : 'Google Analytics',

  key : 'trackingId',

  defaults : {
    // Whether to anonymize the IP address collected for the user.
    anonymizeIp : false,
    // An optional domain setting, to restrict where events can originate from.
    domain : null,
    // Whether to enable GOogle's DoubleClick remarketing feature.
    doubleClick : false,
    // Whether to use Google Analytics's Enhanced Link Attribution feature:
    // http://support.google.com/analytics/bin/answer.py?hl=en&answer=2558867
    enhancedLinkAttribution : false,
    // A domain to ignore for referrers. Maps to _addIgnoredRef
    ignoreReferrer : null,
    // Whether or not to track and initial pageview when initialized.
    initialPageview : true,
    // The setting to use for Google Analytics's Site Speed Sample Rate feature:
    // https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate
    siteSpeedSampleRate : null,
    // Your Google Analytics Tracking ID.
    trackingId : null,
    // Whether you're using the new Universal Analytics or not.
    universalClient: false
  },

  initialize : function (options, ready) {
    if (options.universalClient) this.initializeUniversal(options, ready);
    else this.initializeClassic(options, ready);
  },

  initializeClassic: function (options, ready) {
    window._gaq = window._gaq || [];
    window._gaq.push(['_setAccount', options.trackingId]);

    // Apply a bunch of optional settings.
    if (options.domain) {
      window._gaq.push(['_setDomainName', options.domain]);
    }
    if (options.enhancedLinkAttribution) {
      var protocol = 'https:' === document.location.protocol ? 'https:' : 'http:';
      var pluginUrl = protocol + '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
      window._gaq.push(['_require', 'inpage_linkid', pluginUrl]);
    }
    if (type(options.siteSpeedSampleRate) === 'number') {
      window._gaq.push(['_setSiteSpeedSampleRate', options.siteSpeedSampleRate]);
    }
    if (options.anonymizeIp) {
      window._gaq.push(['_gat._anonymizeIp']);
    }
    if (options.ignoreReferrer) {
      window._gaq.push(['_addIgnoredRef', options.ignoreReferrer]);
    }
    if (options.initialPageview) {
      var path, canon = canonical();
      if (canon) path = url.parse(canon).pathname;
      this.pageview(path);
    }

    // URLs change if DoubleClick is on. Even though Google Analytics makes a
    // queue, the `_gat` object isn't available until the library loads.
    if (options.doubleClick) {
      load('//stats.g.doubleclick.net/dc.js', ready);
    } else {
      load({
        http  : 'http://www.google-analytics.com/ga.js',
        https : 'https://ssl.google-analytics.com/ga.js'
      }, ready);
    }
  },

  initializeUniversal: function (options, ready) {

    // GA-universal lets you set your own queue name
    var global = this.global = 'ga';

    // and needs to know about this queue name in this special object
    // so that future plugins can also operate on the object
    window['GoogleAnalyticsObject'] = global;

    // setup the global variable
    window[global] = window[global] || function () {
      (window[global].q = window[global].q || []).push(arguments);
    };

    // GA also needs to know the current time (all from their snippet)
    window[global].l = 1 * new Date();

    var createOpts = {};

    // Apply a bunch of optional settings.
    if (options.domain)
      createOpts.cookieDomain = options.domain || 'none';
    if (type(options.siteSpeedSampleRate) === 'number')
      createOpts.siteSpeedSampleRate = options.siteSpeedSampleRate;
    if (options.anonymizeIp)
      ga('set', 'anonymizeIp', true);

    ga('create', options.trackingId, createOpts);

    if (options.initialPageview) {
      var path, canon = canonical();
      if (canon) path = url.parse(canon).pathname;
      this.pageview(path);
    }

    load('//www.google-analytics.com/analytics.js');

    // Google makes a queue so it's ready immediately.
    ready();
  },

  track : function (event, properties) {
    properties || (properties = {});

    var value;

    // Since value is a common property name, ensure it is a number and Google
    // requires that it be an integer.
    if (type(properties.value) === 'number') value = Math.round(properties.value);

    // Try to check for a `category` and `label`. A `category` is required,
    // so if it's not there we use `'All'` as a default. We can safely push
    // undefined if the special properties don't exist. Try using revenue
    // first, but fall back to a generic `value` as well.
    if (this.options.universalClient) {
      var opts = {};
      if (properties.noninteraction) opts.nonInteraction = properties.noninteraction;
      window[this.global](
        'send',
        'event',
        properties.category || 'All',
        event,
        properties.label,
        Math.round(properties.revenue) || value,
        opts
      );
    } else {
      window._gaq.push([
        '_trackEvent',
        properties.category || 'All',
        event,
        properties.label,
        Math.round(properties.revenue) || value,
        properties.noninteraction
      ]);
    }
  },

  pageview : function (url) {
    if (this.options.universalClient) {
      window[this.global]('send', 'pageview', url);
    } else {
      window._gaq.push(['_trackPageview', url]);
    }
  }

});
});
require.register("analytics/lib/providers/gosquared.js", function(exports, require, module){
// http://www.gosquared.com/support
// https://www.gosquared.com/customer/portal/articles/612063-tracker-functions

var Provider = require('../provider')
  , user     = require('../user')
  , load     = require('load-script')
  , onBody   = require('on-body');


module.exports = Provider.extend({

  name : 'GoSquared',

  key : 'siteToken',

  defaults : {
    siteToken : null
  },

  initialize : function (options, ready) {
    // GoSquared assumes a body in their script, so we need this wrapper.
    onBody(function () {
      var GoSquared = window.GoSquared = {};
      GoSquared.acct = options.siteToken;
      GoSquared.q = [];
      window._gstc_lt =+ (new Date());

      GoSquared.VisitorName = user.id();
      GoSquared.Visitor = user.traits();

      load('//d1l6p2sc9645hc.cloudfront.net/tracker.js');

      // GoSquared makes a queue, so it's ready immediately.
      ready();
    });
  },

  identify : function (userId, traits) {
    // TODO figure out if this will actually work. Seems like GoSquared will
    // never know these values are updated.
    if (userId) window.GoSquared.UserName = userId;
    if (traits) window.GoSquared.Visitor = traits;
  },

  track : function (event, properties) {
    // GoSquared sets a `gs_evt_name` property with a value of the event
    // name, so it relies on properties being an object.
    window.GoSquared.q.push(['TrackEvent', event, properties || {}]);
  },

  pageview : function (url) {
    window.GoSquared.q.push(['TrackView', url]);
  }

});
});
require.register("analytics/lib/providers/heap.js", function(exports, require, module){
// https://heapanalytics.com/docs

var Provider = require('../provider')
  , load     = require('load-script');

module.exports = Provider.extend({

  name : 'Heap',

  key : 'apiKey',

  defaults : {
    apiKey : null
  },

  initialize : function (options, ready) {
    window.heap=window.heap||[];window.heap.load=function(a){window._heapid=a;var b=document.createElement("script");b.type="text/javascript",b.async=!0,b.src=("https:"===document.location.protocol?"https:":"http:")+"//d36lvucg9kzous.cloudfront.net";var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c);var d=function(a){return function(){heap.push([a].concat(Array.prototype.slice.call(arguments,0)))}},e=["identify","track"];for(var f=0;f<e.length;f++)heap[e[f]]=d(e[f])};
    window.heap.load(options.apiKey);

    // heap creates its own queue, so we're ready right away
    ready();
  },

  identify : function (userId, traits) {
    window.heap.identify(traits);
  },

  track : function (event, properties) {
    window.heap.track(event, properties);
  }

});
});
require.register("analytics/lib/providers/hittail.js", function(exports, require, module){
// http://www.hittail.com

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'HitTail',

  key : 'siteId',

  defaults : {
    siteId : null
  },

  initialize : function (options, ready) {
    load('//' + options.siteId + '.hittail.com/mlt.js', ready);
  }

});
});
require.register("analytics/lib/providers/hubspot.js", function(exports, require, module){
// http://hubspot.clarify-it.com/d/4m62hl

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'HubSpot',

  key : 'portalId',

  defaults : {
    portalId : null
  },

  initialize : function (options, ready) {
    // HubSpot checks in their snippet to make sure another script with
    // `hs-analytics` isn't already in the DOM. Seems excessive, but who knows
    // if there's weird deprecation going on :p
    if (!document.getElementById('hs-analytics')) {
      window._hsq = window._hsq || [];
      var script = load('https://js.hubspot.com/analytics/' + (Math.ceil(new Date()/300000)*300000) + '/' + options.portalId + '.js');
      script.id = 'hs-analytics';
    }

    // HubSpot makes a queue, so it's ready immediately.
    ready();
  },

  // HubSpot does not use a userId, but the email address is required on
  // the traits object.
  identify : function (userId, traits) {
    window._hsq.push(["identify", traits]);
  },

  // Event Tracking is available to HubSpot Enterprise customers only. In
  // addition to adding any unique event name, you can also use the id of an
  // existing custom event as the event variable.
  track : function (event, properties) {
    window._hsq.push(["trackEvent", event, properties]);
  },

  // HubSpot doesn't support passing in a custom URL.
  pageview : function (url) {
    window._hsq.push(['_trackPageview']);
  }

});
});
<<<<<<< HEAD
require.register("analytics/lib/providers/index.js", function(exports, require, module){

module.exports = {
  'AdRoll'                   : require('./adroll'),
  'Amplitude'                : require('./amplitude'),
  'BugHerd'                  : require('./bugherd'),
  'Chartbeat'                : require('./chartbeat'),
  'ClickTale'                : require('./clicktale'),
  'Clicky'                   : require('./clicky'),
  'comScore'                 : require('./comscore'),
  'CrazyEgg'                 : require('./crazyegg'),
  'Customer.io'              : require('./customerio'),
  'Errorception'             : require('./errorception'),
  'FoxMetrics'               : require('./foxmetrics'),
  'Gauges'                   : require('./gauges'),
  'Get Satisfaction'         : require('./get-satisfaction'),
  'Google Analytics'         : require('./google-analytics'),
  'GoSquared'                : require('./gosquared'),
  'Heap'                     : require('./heap'),
  'HitTail'                  : require('./hittail'),
  'HubSpot'                  : require('./hubspot'),
  'Improvely'                : require('./improvely'),
  'Intercom'                 : require('./intercom'),
  'Keen IO'                  : require('./keen-io'),
  'KISSmetrics'              : require('./kissmetrics'),
  'Klaviyo'                  : require('./klaviyo'),
  'LeadLander'               : require('./leadlander'),
  'LiveChat'                 : require('./livechat'),
  'Lytics'                   : require('./lytics'),
  'Mixpanel'                 : require('./mixpanel'),
  'Olark'                    : require('./olark'),
  'Optimizely'               : require('./optimizely'),
  'Perfect Audience'         : require('./perfect-audience'),
  'Pingdom'                  : require('./pingdom'),
  'Preact'                   : require('./preact'),
  'Qualaroo'                 : require('./qualaroo'),
  'Quantcast'                : require('./quantcast'),
  'Sentry'                   : require('./sentry'),
  'SnapEngage'               : require('./snapengage'),
  'trak.io'                  : require('./trakio'),
  'USERcycle'                : require('./usercycle'),
  'userfox'                  : require('./userfox'),
  'UserVoice'                : require('./uservoice'),
  'Vero'                     : require('./vero'),
  'Visual Website Optimizer' : require('./visual-website-optimizer'),
  'Woopra'                   : require('./woopra')
};
=======
require.register("analytics/src/providers/index.js", function(exports, require, module){
module.exports = [
  require('./adroll'),
  require('./amplitude'),
  require('./bitdeli'),
  require('./bugherd'),
  require('./chartbeat'),
  require('./clicktale'),
  require('./clicky'),
  require('./comscore'),
  require('./crazyegg'),
  require('./customerio'),
  require('./errorception'),
  require('./foxmetrics'),
  require('./gauges'),
  require('./get-satisfaction'),
  require('./google-analytics'),
  require('./gosquared'),
  require('./heap'),
  require('./hittail'),
  require('./hubspot'),
  require('./improvely'),
  require('./intercom'),
  require('./keen-io'),
  require('./kissmetrics'),
  require('./klaviyo'),
  require('./livechat'),
  require('./lytics'),
  require('./mixpanel'),
  require('./olark'),
  require('./optimizely'),
  require('./perfect-audience'),
  require('./pingdom'),
  require('./preact'),
  require('./qualaroo'),
  require('./quantcast'),
  require('./sentry'),
  require('./snapengage'),
  require('./spinnakr'),
  require('./usercycle'),
  require('./userfox'),
  require('./uservoice'),
  require('./vero'),
  require('./visual-website-optimizer'),
  require('./woopra')
];

>>>>>>> 8c071b08d644c505143271d681a41168b1ca3fea
});
require.register("analytics/lib/providers/improvely.js", function(exports, require, module){
// http://www.improvely.com/docs/landing-page-code
// http://www.improvely.com/docs/conversion-code
// http://www.improvely.com/docs/labeling-visitors

var Provider = require('../provider')
  , alias    = require('alias')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Improvely',

  defaults : {
    // Improvely requires two options: `domain` and `projectId`.
    domain : null,
    projectId : null
  },

  initialize : function (options, ready) {
    window._improvely = window._improvely || [];
    window.improvely = window.improvely || {
      init  : function (e, t) { window._improvely.push(["init", e, t]); },
      goal  : function (e) { window._improvely.push(["goal", e]); },
      label : function (e) { window._improvely.push(["label", e]); }
    };

    load('//' + options.domain + '.iljmp.com/improvely.js');
    window.improvely.init(options.domain, options.projectId);

    // Improvely creates a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    if (userId) window.improvely.label(userId);
  },

  track : function (event, properties) {
    // Improvely calls `revenue` `amount`, and puts the `event` in properties as
    // the `type`.
    properties || (properties = {});
    properties.type = event;
    alias(properties, { 'revenue' : 'amount' });
    window.improvely.goal(properties);
  }

});

});
require.register("analytics/lib/providers/intercom.js", function(exports, require, module){
// http://docs.intercom.io/
// http://docs.intercom.io/#IntercomJS

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  name : 'Intercom',

  // Whether Intercom has already been booted or not. Intercom becomes booted
  // after Intercom('boot', ...) has been called on the first identify.
  booted : false,

  key : 'appId',

  defaults : {
    // Intercom's required key.
    appId : null,
    // An optional setting to display the Intercom inbox widget.
    activator : null,
    // Whether to show the count of messages for the inbox widget.
    counter : true
  },

  initialize : function (options, ready) {
    load('https://static.intercomcdn.com/intercom.v1.js', ready);
  },

  identify : function (userId, traits, options) {
    // Don't do anything if we just have traits the first time.
    if (!this.booted && !userId) return;

    // Intercom specific settings. BACKWARDS COMPATIBILITY: we need to check for
    // the lowercase variant as well.
    options || (options = {});
    var Intercom = options.Intercom || options.intercom || {};
    traits.increments = Intercom.increments;
    traits.user_hash = Intercom.userHash || Intercom.user_hash;

    // They need `created_at` as a Unix timestamp (seconds).
    if (traits.created) {
      traits.created_at = Math.floor(traits.created/1000);
      delete traits.created;
    }

    // Convert a `company`'s `created` date.
    if (traits.company && traits.company.created) {
      traits.company.created_at = Math.floor(traits.company.created/1000);
      delete traits.company.created;
    }

    // Optionally add the inbox widget.
    if (this.options.activator) {
      traits.widget = {
        activator   : this.options.activator,
        use_counter : this.options.counter
      };
    }

    // If this is the first time we've identified, `boot` instead of `update`
    // and add our one-time boot settings.
    if (this.booted) {
      window.Intercom('update', traits);
    } else {
      extend(traits, {
        app_id  : this.options.appId,
        user_id : userId
      });
      window.Intercom('boot', traits);
    }

    // Set the booted state, so that we know to call 'update' next time.
    this.booted = true;
  },

  // Intercom doesn't have a separate `group` method, but they take a
  // `companies` trait for the user.
  group : function (groupId, properties, options) {
    properties.id = groupId;
    window.Intercom('update', { company : properties });
  }

});

});
require.register("analytics/lib/providers/keen-io.js", function(exports, require, module){
// https://keen.io/docs/

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Keen IO',

  defaults : {
    // The Project ID is **required**.
    projectId : null,
    // The Write Key is **required** to send events.
    writeKey : null,
    // The Read Key is optional, only if you want to "do analysis".
    readKey : null,
    // Whether or not to pass pageviews on to Keen IO.
    pageview : true,
    // Whether or not to track an initial pageview on `initialize`.
    initialPageview : true
  },

  initialize : function (options, ready) {
    window.Keen = window.Keen||{configure:function(e){this._cf=e},addEvent:function(e,t,n,i){this._eq=this._eq||[],this._eq.push([e,t,n,i])},setGlobalProperties:function(e){this._gp=e},onChartsReady:function(e){this._ocrq=this._ocrq||[],this._ocrq.push(e)}};
    window.Keen.configure({
      projectId : options.projectId,
      writeKey  : options.writeKey,
      readKey   : options.readKey
    });

    load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js');

    if (options.initialPageview) this.pageview();

    // Keen IO defines all their functions in the snippet, so they're ready.
    ready();
  },

  identify : function (userId, traits) {
    // Use Keen IO global properties to include `userId` and `traits` on
    // every event sent to Keen IO.
    var globalUserProps = {};
    if (userId) globalUserProps.userId = userId;
    if (traits) globalUserProps.traits = traits;
    if (userId || traits) {
      window.Keen.setGlobalProperties(function(eventCollection) {
        return { user: globalUserProps };
      });
    }
  },

  track : function (event, properties) {
    window.Keen.addEvent(event, properties);
  },

  pageview : function (url) {
    if (!this.options.pageview) return;

    var properties = {
      url  : url || document.location.href,
      name : document.title
    };

    this.track('Loaded a Page', properties);
  }

});
});
require.register("analytics/lib/providers/kissmetrics.js", function(exports, require, module){
// http://support.kissmetrics.com/apis/javascript

var Provider = require('../provider')
  , alias    = require('alias')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'KISSmetrics',

  key : 'apiKey',

  defaults : {
    apiKey : null
  },

  initialize : function (options, ready) {
    window._kmq = window._kmq || [];
    load('//i.kissmetrics.com/i.js');
    load('//doug1izaerwt3.cloudfront.net/' + options.apiKey + '.1.js');

    // KISSmetrics creates a queue, so it's ready immediately.
    ready();
  },

  // KISSmetrics uses two separate methods: `identify` for storing the
  // `userId`, and `set` for storing `traits`.
  identify : function (userId, traits) {
    if (userId) window._kmq.push(['identify', userId]);
    if (traits) window._kmq.push(['set', traits]);
  },

  track : function (event, properties) {
    // KISSmetrics handles revenue with the `'Billing Amount'` property by
    // default, although it's changeable in the interface.
    if (properties) {
      alias(properties, {
        'revenue' : 'Billing Amount'
      });
    }

    window._kmq.push(['record', event, properties]);
  },

  // Although undocumented, KISSmetrics actually supports not passing a second
  // ID, in which case it uses the currenty identified user's ID.
  alias : function (newId, originalId) {
    window._kmq.push(['alias', newId, originalId]);
  }

});
});
require.register("analytics/lib/providers/klaviyo.js", function(exports, require, module){
// https://www.klaviyo.com/docs

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Klaviyo',

  key : 'apiKey',

  defaults : {
    apiKey : null
  },

  initialize : function (options, ready) {
    window._learnq = window._learnq || [];
    window._learnq.push(['account', options.apiKey]);
    load('//a.klaviyo.com/media/js/learnmarklet.js');

    // Klaviyo creats a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    // Klaviyo requires a `userId` and takes the it on the traits object itself.
    if (!userId) return;
    traits.$id = userId;
    window._learnq.push(['identify', traits]);
  },

  track : function (event, properties) {
    window._learnq.push(['track', event, properties]);
  }

});
});
require.register("analytics/lib/providers/leadlander.js", function(exports, require, module){
var Provider = require('../provider')
  , load     = require('load-script');

module.exports = Provider.extend({

  name : 'LeadLander',

  key : 'llactid',

  defaults : {
    llactid : null
  },

  initialize : function (options, ready) {
    window.llactid = options.llactid;
    load('//trackalyzer.com/trackalyze.js', ready);
  }

});
});
require.register("analytics/lib/providers/livechat.js", function(exports, require, module){
// http://www.livechatinc.com/api/javascript-api

var Provider = require('../provider')
  , each     = require('each')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'LiveChat',

  key : 'license',

  defaults : {
    license : null
  },

  initialize : function (options, ready) {
    window.__lc = { license : options.license };
    load('//cdn.livechatinc.com/tracking.js', ready);
  },

  // LiveChat isn't an analytics service, but we can use the `userId` and
  // `traits` to tag the user with their real name in the chat console.
  identify : function (userId, traits) {
    // In case the LiveChat library hasn't loaded yet.
    if (!window.LC_API) return;

    // LiveChat takes them in an array format.
    var variables = [];

    if (userId) variables.push({ name: 'User ID', value: userId });
    if (traits) {
      each(traits, function (key, value) {
        variables.push({
          name  : key,
          value : value
        });
      });
    }

    window.LC_API.set_custom_variables(variables);
  }

});
});
require.register("analytics/lib/providers/lytics.js", function(exports, require, module){

var alias = require('alias')
  , clone = require('clone')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose a `Lytics` integration.
 *
 * http://admin.lytics.io/doc#jstag
 */

var Lytics = module.exports = integration('Lytics');


/**
 * Required key.
 */

Lytics.prototype.key = 'cid';


/**
 * Default options.
 */

Lytics.prototype.defaults = {
  // accound identified (required)
  cid: '',
  // what to name the lytics cookie
  cookie: 'seerid',
  // how long to wait for collector requests
  delay: 200,
  // whether to track an initial page view on load
  initialPageview: true,
  // duration in milliseconds after a session should be considered inactive
  sessionTimeout: 1800,
  // collector url
  url: '//c.lytics.io'
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Lytics.prototype.initialize = function (options, ready) {
  var cloned = clone(options);
  alias(cloned, {
    sessionTimeout: 'sessecs'
  });

  window.jstag = (function () {
    var t = {
      _q: [],
      _c: cloned,
      ts: (new Date()).getTime()
    };
    t.send = function() {
      this._q.push([ 'ready', 'send', Array.prototype.slice.call(arguments) ]);
      return this;
    };
    return t;
  })();

  load('//c.lytics.io/static/io.min.js');
  if (options.initialPageview)  this.pageview();
  ready();
};


/**
 * Idenfity.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Lytics.prototype.identify = function (id, traits, options) {
  if (id) traits._uid = id;
  window.jstag.send(traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Lytics.prototype.track = function (event, properties) {
  properties._e = event;
  window.jstag.send(properties);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Lytics.prototype.pageview = function (url) {
  window.jstag.send();
};
});
require.register("analytics/lib/providers/mixpanel.js", function(exports, require, module){
// https://mixpanel.com/docs/integration-libraries/javascript
// https://mixpanel.com/docs/people-analytics/javascript
// https://mixpanel.com/docs/integration-libraries/javascript-full-api

var Provider = require('../provider')
  , alias    = require('alias')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Mixpanel',

  key : 'token',

  defaults : {
    // Whether to call `mixpanel.nameTag` on `identify`.
    nameTag : true,
    // Whether to use Mixpanel's People API.
    people : false,
    // The Mixpanel API token for your account.
    token : null,
    // Whether to track pageviews to Mixpanel.
    pageview : false,
    // Whether to track an initial pageview on initialize.
    initialPageview : false,
    // A custom cookie name to use
    cookieName : null
  },

  initialize : function (options, ready) {
    (function (c, a) {
        window.mixpanel = a;
        var b, d, h, e;
        a._i = [];
        a.init = function (b, c, f) {
          function d(a, b) {
            var c = b.split('.');
            2 == c.length && (a = a[c[0]], b = c[1]);
            a[b] = function () {
                a.push([b].concat(Array.prototype.slice.call(arguments, 0)));
            };
          }
          var g = a;
          'undefined' !== typeof f ? g = a[f] = [] : f = 'mixpanel';
          g.people = g.people || [];
          h = ['disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'alias', 'name_tag', 'set_config', 'people.set', 'people.increment', 'people.track_charge', 'people.append'];
          for (e = 0; e < h.length; e++) d(g, h[e]);
          a._i.push([b, c, f]);
        };
        a.__SV = 1.2;
        // Modification to the snippet: call ready whenever the library has
        // fully loaded.
        load('//cdn.mxpnl.com/libs/mixpanel-2.2.min.js', ready);
    })(document, window.mixpanel || []);

    // Mixpanel only accepts snake_case options
    options.cookie_name = options.cookieName;

    // Pass options directly to `init` as the second argument.
    window.mixpanel.init(options.token, options);

    if (options.initialPageview) this.pageview();
  },

  identify : function (userId, traits) {
    // Alias the traits' keys with dollar signs for Mixpanel's API.
    alias(traits, {
      'created'   : '$created',
      'email'     : '$email',
      'firstName' : '$first_name',
      'lastName'  : '$last_name',
      'lastSeen'  : '$last_seen',
      'name'      : '$name',
      'username'  : '$username',
      'phone'     : '$phone'
    });

    // Finally, call all of the identify equivalents. Verify certain calls
    // against options to make sure they're enabled.
    if (userId) {
      window.mixpanel.identify(userId);
      if (this.options.nameTag) window.mixpanel.name_tag(traits && traits.$email || userId);
    }
    if (traits) {
      window.mixpanel.register(traits);
      if (this.options.people) window.mixpanel.people.set(traits);
    }
  },

  track : function (event, properties) {
    window.mixpanel.track(event, properties);

    // Mixpanel handles revenue with a `transaction` call in their People
    // feature. So if we're using people, record a transcation.
    if (properties && properties.revenue && this.options.people) {
      window.mixpanel.people.track_charge(properties.revenue);
    }
  },

  // Mixpanel doesn't actually track the pageviews, but they do show up in the
  // Mixpanel stream.
  pageview : function (url) {
    window.mixpanel.track_pageview(url);

    // If they don't want pageviews tracked, leave now.
    if (!this.options.pageview) return;

    var properties = {
      url  : url || document.location.href,
      name : document.title
    };

    this.track('Loaded a Page', properties);
  },

  // Although undocumented, Mixpanel actually supports the `originalId`. It
  // just usually defaults to the current user's `distinct_id`.
  alias : function (newId, originalId) {

    if(window.mixpanel.get_distinct_id &&
       window.mixpanel.get_distinct_id() === newId) return;

    // HACK: internal mixpanel API to ensure we don't overwrite.
    if(window.mixpanel.get_property &&
       window.mixpanel.get_property('$people_distinct_id') === newId) return;

    window.mixpanel.alias(newId, originalId);
  }

});
});
require.register("analytics/lib/providers/olark.js", function(exports, require, module){
// http://www.olark.com/documentation

var Provider = require('../provider')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  name : 'Olark',

  key : 'siteId',

  chatting : false,

  defaults : {
    siteId : null,
    // Whether to use the user's name or email in the Olark chat console.
    identify : true,
    // Whether to log pageviews to the Olark chat console.
    track : false,
    // Whether to log pageviews to the Olark chat console.
    pageview : true
  },

  initialize : function (options, ready) {
    window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
    window.olark.identify(options.siteId);

    // Set up event handlers for chat box open and close so that
    // we know whether a conversation is active. If it is active,
    // then we'll send track and pageview information.
    var self = this;
    window.olark('api.box.onExpand', function () { self.chatting = true; });
    window.olark('api.box.onShrink', function () { self.chatting = false; });

    // Olark creates it's method in the snippet, so it's ready immediately.
    ready();
  },

  // Update traits about the user in Olark to make the operator's life easier.
  identify : function (userId, traits) {
    if (!this.options.identify) return;

    var email    = traits.email
      , name     = traits.name || traits.firstName
      , phone    = traits.phone
      , nickname = name || email || userId;

    // If we have a name and an email, add the email too to be more helpful.
    if (name && email) nickname += ' ('+email+')';

    // Call all of Olark's settings APIs.
    window.olark('api.visitor.updateCustomFields', traits);
    if (email)    window.olark('api.visitor.updateEmailAddress', { emailAddress : email });
    if (name)     window.olark('api.visitor.updateFullName', { fullName : name });
    if (phone)    window.olark('api.visitor.updatePhoneNumber', { phoneNumber : phone });
    if (nickname) window.olark('api.chat.updateVisitorNickname', { snippet : nickname });
  },

  // Log events the user triggers to the chat console, if you so desire it.
  track : function (event, properties) {
    if (!this.options.track || !this.chatting) return;

    // To stay consistent with olark's default messages, it's all lowercase.
    window.olark('api.chat.sendNotificationToOperator', {
      body : 'visitor triggered "'+event+'"'
    });
  },

  // Mimic the functionality Olark has for normal pageviews with pseudo-
  // pageviews, telling the operator when a visitor changes pages.
  pageview : function (url) {
    if (!this.options.pageview || !this.chatting) return;

    // To stay consistent with olark's default messages, it's all lowercase.
    window.olark('api.chat.sendNotificationToOperator', {
      body : 'looking at ' + window.location.href
    });
  }

});
});
require.register("analytics/lib/providers/optimizely.js", function(exports, require, module){
// https://www.optimizely.com/docs/api

var each      = require('each')
  , nextTick  = require('next-tick')
  , Provider  = require('../provider');


module.exports = Provider.extend({

  name : 'Optimizely',

  defaults : {
    // Whether to replay variations into other enabled integrations as traits.
    variations : true
  },

  initialize : function (options, ready, analytics) {
    // Create the `optimizely` object in case it doesn't exist already.
    // https://www.optimizely.com/docs/api#function-calls
    window.optimizely = window.optimizely || [];

    // If the `variations` option is true, replay our variations on the next
    // tick to wait for the entire library to be ready for replays.
    if (options.variations) {
      var self = this;
      nextTick(function () { self.replay(); });
    }

    // Optimizely should be on the page already, so it's always ready.
    ready();
  },

  track : function (event, properties) {
    // Optimizely takes revenue as cents, not dollars.
    if (properties && properties.revenue) properties.revenue = properties.revenue * 100;

    window.optimizely.push(['trackEvent', event, properties]);
  },

  replay : function () {
    // Make sure we have access to Optimizely's `data` dictionary.
    var data = window.optimizely.data;
    if (!data) return;

    // Grab a few pieces of data we'll need for replaying.
    var experiments       = data.experiments
      , variationNamesMap = data.state.variationNamesMap;

    // Create our traits object to add variations to.
    var traits = {};

    // Loop through all the experiement the user has been assigned a variation
    // for and add them to our traits.
    each(variationNamesMap, function (experimentId, variation) {
      traits['Experiment: ' + experiments[experimentId].name] = variation;
    });

    this.analytics.identify(traits);
  }

});
});
require.register("analytics/lib/providers/perfect-audience.js", function(exports, require, module){
// https://www.perfectaudience.com/docs#javascript_api_autoopen

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Perfect Audience',

  key : 'siteId',

  defaults : {
    siteId : null
  },

  initialize : function (options, ready) {
    window._pa || (window._pa = {});
    load('//tag.perfectaudience.com/serve/' + options.siteId + '.js', ready);
  },

  track : function (event, properties) {
    window._pa.track(event, properties);
  }

});
});
require.register("analytics/lib/providers/pingdom.js", function(exports, require, module){
var date     = require('load-date')
  , Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Pingdom',

  key : 'id',

  defaults : {
    id : null
  },

  initialize : function (options, ready) {

    window._prum = [
      ['id', options.id],
      ['mark', 'firstbyte', date.getTime()]
    ];

    // We've replaced the original snippet loader with our own load method.
    load('//rum-static.pingdom.net/prum.min.js', ready);
  }

});
});
require.register("analytics/lib/providers/preact.js", function(exports, require, module){
// http://www.preact.io/api/javascript

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');

module.exports = Provider.extend({

  name : 'Preact',

  key : 'projectCode',

  defaults : {
    projectCode    : null
  },

  initialize : function (options, ready) {
    var _lnq = window._lnq = window._lnq || [];
    _lnq.push(["_setCode", options.projectCode]);

    load('//d2bbvl6dq48fa6.cloudfront.net/js/ln-2.4.min.js');
    ready();
  },

  identify : function (userId, traits) {
    // Don't do anything if we just have traits. Preact requires a `userId`.
    if (!userId) return;

    // Swap the `created` trait to the `created_at` that Preact needs
    // and convert it from milliseconds to seconds.
    if (traits.created) {
      traits.created_at = Math.floor(traits.created/1000);
      delete traits.created;
    }

    window._lnq.push(['_setPersonData', {
      name       : traits.name,
      email      : traits.email,
      uid        : userId,
      properties : traits
    }]);
  },

  group : function (groupId, properties) {
    if (!groupId) return;
    properties.id = groupId;
    window._lnq.push(['_setAccount', properties]);
  },

  track : function (event, properties) {
    properties || (properties = {});

    // Preact takes a few special properties, and the rest in `extras`. So first
    // convert and remove the special ones from `properties`.
    var special = { name : event };

    // They take `revenue` in cents.
    if (properties.revenue) {
      special.revenue = properties.revenue * 100;
      delete properties.revenue;
    }

    if (properties.note) {
      special.note = properties.note;
      delete properties.note;
    }

    window._lnq.push(['_logEvent', special, properties]);
  }

});
});
require.register("analytics/lib/providers/qualaroo.js", function(exports, require, module){
// http://help.qualaroo.com/customer/portal/articles/731085-identify-survey-nudge-takers
// http://help.qualaroo.com/customer/portal/articles/731091-set-additional-user-properties

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Qualaroo',

  defaults : {
    // Qualaroo has two required options.
    customerId : null,
    siteToken : null,
    // Whether to record traits when a user triggers an event. This can be
    // useful for sending targetted questionnaries.
    track : false
  },

  // Qualaroo's script has two options in its URL.
  initialize : function (options, ready) {
    window._kiq = window._kiq || [];
    load('//s3.amazonaws.com/ki.js/' + options.customerId + '/' + options.siteToken + '.js');

    // Qualaroo creates a queue, so it's ready immediately.
    ready();
  },

  // Qualaroo uses two separate methods: `identify` for storing the `userId`,
  // and `set` for storing `traits`.
  identify : function (userId, traits) {
    var identity = traits.email || userId;
    if (identity) window._kiq.push(['identify', identity]);
    if (traits) window._kiq.push(['set', traits]);
  },

  // Qualaroo doesn't have `track` method yet, but to allow the users to do
  // targetted questionnaires we can set name-value pairs on the user properties
  // that apply to the current visit.
  track : function (event, properties) {
    if (!this.options.track) return;

    // Create a name-value pair that will be pretty unique. For an event like
    // 'Loaded a Page' this will make it 'Triggered: Loaded a Page'.
    var traits = {};
    traits['Triggered: ' + event] = true;

    // Fire a normal identify, with traits only.
    this.identify(null, traits);
  }

});
});
require.register("analytics/lib/providers/quantcast.js", function(exports, require, module){
// https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Quantcast',

  key : 'pCode',

  defaults : {
    pCode : null
  },

  initialize : function (options, ready) {
    window._qevents = window._qevents || [];
    window._qevents.push({ qacct: options.pCode });
    load({
      http  : 'http://edge.quantserve.com/quant.js',
      https : 'https://secure.quantserve.com/quant.js'
    }, ready);
  }

});
});
require.register("analytics/lib/providers/sentry.js", function(exports, require, module){
// http://raven-js.readthedocs.org/en/latest/config/index.html

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Sentry',

  key : 'config',

  defaults : {
    config : null
  },

  initialize : function (options, ready) {
    load('//d3nslu0hdya83q.cloudfront.net/dist/1.0/raven.min.js', function () {
      // For now, Raven basically requires `install` to be called.
      // https://github.com/getsentry/raven-js/blob/master/src/raven.js#L87
      window.Raven.config(options.config).install();
      ready();
    });
  },

  identify : function (userId, traits) {
    traits.id = userId;
    window.Raven.setUser(traits);
  },

  // Raven will automatically use `captureMessage` if the error is a string.
  log : function (error, properties) {
    window.Raven.captureException(error, properties);
  }

});
});
require.register("analytics/lib/providers/snapengage.js", function(exports, require, module){
// http://help.snapengage.com/installation-guide-getting-started-in-a-snap/

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'SnapEngage',

  key : 'apiKey',

  defaults : {
    apiKey : null
  },

  initialize : function (options, ready) {
    load('//commondatastorage.googleapis.com/code.snapengage.com/js/' + options.apiKey + '.js', ready);
  },

  // Set the email in the chat window if we have it.
  identify : function (userId, traits, options) {
    if (!traits.email) return;
    window.SnapABug.setUserEmail(traits.email);
  }

});
});
require.register("analytics/lib/providers/trakio.js", function(exports, require, module){

var integration = require('../integration')
  , alias = require('alias')
  , clone = require('clone')
  , load = require('load-script');


/**
 * Expose a `trak.io` provider.
 *
 * https://docs.trak.io
 */

var Trakio = module.exports = integration('trak.io');


/**
 * Required key.
 */

Trakio.prototype.key = 'token';


/**
 * Default options.
 */

Trakio.prototype.defaults = {
  // whether to track an initial pageview
  initialPageview : true,
  // whether to track pageviews
  pageview : true,
  // the token for your trak.io account (required)
  token : ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Trakio.prototype.initialize = function (options, ready) {
  window.trak = window.trak || [];
  window.trak.io = window.trak.io || {};
  window.trak.io.load = function(e) {
    load('//d29p64779x43zo.cloudfront.net/v1/trak.io.min.js');
    var r = function(e) {
      return function() {
        window.trak.push([e].concat(Array.prototype.slice.call(arguments,0)));
      };
    }
    ,i=["initialize","identify","track","alias","channel","source","host","protocol","page_view"];
    for (var s=0;s<i.length;s++) window.trak.io[i[s]]=r(i[s]);
    window.trak.io.initialize.apply(window.trak.io,arguments);
  };

  var cloned = clone(options);
  alias(cloned, {
    initialPageview: 'auto_track_page_view'
  });

  window.trak.io.load(options.token, cloned);
  ready();
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Trakio.prototype.identify = function (id, traits, options) {
  if (id) {
    window.trak.io.identify(id, traits);
  } else {
    window.trak.io.identify(traits);
  }
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Trakio.prototype.track = function (event, properties, options) {
  window.trak.io.track(event, properties);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Trakio.prototype.pageview = function (url) {
  if (!this.options.pageview) return;
  window.trak.io.page_view(url);
};


/**
 * Alias.
 *
 * @param {String} newId
 * @param {String} originalId (optional)
 */

Trakio.prototype.alias = function (newId, originalId) {
  var id = window.trak.io.distinct_id();
  if (id === newId) return;
  if (originalId) {
    window.trak.io.alias(originalId, newId);
  } else {
    window.trak.io.alias(newId);
  }
};
});
require.register("analytics/lib/providers/usercycle.js", function(exports, require, module){
// http://docs.usercycle.com/javascript_api

var Provider = require('../provider')
  , load     = require('load-script')
  , user     = require('../user');


module.exports = Provider.extend({

  name : 'USERcycle',

  key : 'key',

  defaults : {
    key : null
  },

  initialize : function (options, ready) {
    window._uc = window._uc || [];
    window._uc.push(['_key', options.key]);
    load('//api.usercycle.com/javascripts/track.js');

    // USERcycle makes a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    if (userId) window._uc.push(['uid', userId]);

    // USERcycle has a special "hidden" event that is used just for retention measurement.
    // Lukas suggested on 6/4/2013 that we send traits on that event, since they use the
    // the latest value of every event property as a "trait"
    window._uc.push(['action', 'came_back', traits]);
  },

  track : function (event, properties) {
    window._uc.push(['action', event, properties]);
  }

});
});
require.register("analytics/lib/providers/userfox.js", function(exports, require, module){
// https://www.userfox.com/docs/

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  name : 'userfox',

  key : 'clientId',

  defaults : {
    // userfox's required key.
    clientId : null
  },

  initialize : function (options, ready) {
    window._ufq = window._ufq || [];
    load('//d2y71mjhnajxcg.cloudfront.net/js/userfox-stable.js');

    // userfox creates its own queue, so we're ready right away.
    ready();
  },

  identify : function (userId, traits) {
    if (!traits.email) return;

    // Initialize the library with the email now that we have it.
    window._ufq.push(['init', {
      clientId : this.options.clientId,
      email    : traits.email
    }]);

    // Record traits to "track" if we have the required signup date `created`.
    // userfox takes `signup_date` as a string of seconds since the epoch.
    if (traits.created) {
      traits.signup_date = (traits.created.getTime() / 1000).toString();
      delete traits.created;
      window._ufq.push(['track', traits]);
    }
  }

});

});
require.register("analytics/lib/providers/uservoice.js", function(exports, require, module){

var Provider = require('../provider')
  , load     = require('load-script')
  , alias    = require('alias')
  , clone    = require('clone');


module.exports = Provider.extend({

  name : 'UserVoice',

  key: 'widgetId',

  defaults : {
    widgetId : null
  },

  initialize : function (options, ready) {
    window.UserVoice = window.UserVoice || [];
    load('//widget.uservoice.com/' + options.widgetId + '.js', ready);

    // BACKWARDS COMPATIBILITY: noop this old method, so we don't break sites
    window.showClassicWidget = function(){};
  },

  identify : function (userId, traits) {
    // Pull the ID into traits.
    traits.id = userId;
    window.UserVoice.push(['setCustomFields', traits]);
  }

});
});
require.register("analytics/lib/providers/vero.js", function(exports, require, module){
// https://github.com/getvero/vero-api/blob/master/sections/js.md

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Vero',

  key : 'apiKey',

  defaults : {
    apiKey : null
  },

  initialize : function (options, ready) {
    window._veroq = window._veroq || [];
    window._veroq.push(['init', { api_key: options.apiKey }]);
    load('//d3qxef4rp70elm.cloudfront.net/m.js');

    // Vero creates a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    // Don't do anything if we just have traits, because Vero
    // requires a `userId`.
    if (!userId || !traits.email) return;

    // Vero takes the `userId` as part of the traits object.
    traits.id = userId;

    window._veroq.push(['user', traits]);
  },

  track : function (event, properties) {
    window._veroq.push(['track', event, properties]);
  }

});
});
require.register("analytics/lib/providers/visual-website-optimizer.js", function(exports, require, module){
// http://v2.visualwebsiteoptimizer.com/tools/get_tracking_code.php
// http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/

var callback = require('callback')
  , each = require('each')
  , inherit = require('inherit')
  , nextTick = require('next-tick')
  , Provider = require('../provider');


/**
 * Expose `VWO`.
 */

module.exports = VWO;


/**
 * `VWO` inherits from the generic `Provider`.
 */

function VWO () {
  Provider.apply(this, arguments);
}

inherit(VWO, Provider);


/**
 * Name.
 */

VWO.prototype.name = 'Visual Website Optimizer';


/**
 * Default options.
 */

VWO.prototype.defaults = {
  // Whether to replay variations into other integrations as traits.
  replay : true
};


/**
 * Initialize.
 */

VWO.prototype.initialize = function (options, ready) {
  if (options.replay) this.replay();
  callback.async(ready);
};


/**
 * Replay the experiments the user has seen as traits to all other integrations.
 * Wait for the next tick to replay so that the `analytics` object and all of
 * the integrations are fully initialized.
 */

VWO.prototype.replay = function () {
  var analytics = this.analytics;
  nextTick(function () {
    experiments(function (err, traits) {
      if (traits) analytics.identify(traits);
    });
  });
};


/**
 * Get dictionary of experiment keys and variations.
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param  {Function} callback  Called with `err, experiments`.
 * @return {Object}             Dictionary of experiments and variations.
 */

function experiments (callback) {
  enqueue(function () {
    var data = {};
    var ids = window._vwo_exp_ids;
    if (!ids) return callback();
    each(ids, function (id) {
      var name = variation(id);
      if (name) data['Experiment: ' + id] = name;
    });
    callback(null, data);
  });
}


/**
 * Add a function to the VWO queue, creating one if it doesn't exist.
 *
 * @param {Function} fn  Function to enqueue.
 */

function enqueue (fn) {
  window._vis_opt_queue || (window._vis_opt_queue = []);
  window._vis_opt_queue.push(fn);
}


/**
 * Get the chosen variation's name from an experiment `id`.
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param  {String} id  ID of the experiment to read.
 * @return {String}     Variation name.
 */

function variation (id) {
  var experiments = window._vwo_exp;
  if (!experiments) return null;
  var experiment = experiments[id];
  var variationId = experiment.combination_chosen;
  return variationId ? experiment.comb_n[variationId] : null;
}
});
require.register("analytics/lib/providers/woopra.js", function(exports, require, module){
// http://www.woopra.com/docs/setup/javascript-tracking/

var Provider = require('../provider')
  , each     = require('each')
  , extend   = require('extend')
  , isEmail  = require('is-email')
  , load     = require('load-script')
  , type     = require('type')
  , user     = require('../user');


module.exports = Provider.extend({

  name : 'Woopra',

  key : 'domain',

  defaults : {
    domain : null,
    // whether to track a page view on initial page load
    initialPageview : true
  },

  initialize : function (options, ready) {
    // the Woopra snippet, minus the async script loading
    (function () {
      var i, s, z, w = window, d = document, a = arguments, q = 'script',
        f = ['config', 'track', 'identify', 'visit', 'push', 'call'],
        c = function () {
          var i, self = this;
          self._e = [];
          for (i = 0; i < f.length; i++) {
            (function (f) {
              self[f] = function () {
                // need to do this so params get called properly
                self._e.push([f].concat(Array.prototype.slice.call(arguments, 0)));
                return self;
              };
            })(f[i]);
          }
        };
      w._w = w._w || {};
      // check if instance of tracker exists
      for (i = 0; i < a.length; i++) {
        w._w[a[i]] = w[a[i]] = w[a[i]] || new c();
      }
    })('woopra');

    load('//static.woopra.com/js/w.js', ready);

    window.woopra.config({
      domain: options.domain
    });

    if (options.initialPageview) this.pageview();
  },

  identify : function (id, traits) {
    if (id) traits.id = id;
    // `push` calls identify without sending an event
    window.woopra.identify(traits).push();
  },

  track : function (event, properties) {
    window.woopra.track(event, properties);
  },

  pageview : function (url, options) {
    window.woopra.track('pv', {
      url: url
    });
  }

});

});





























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

require.alias("ianstormtaylor-callback/index.js", "analytics/deps/callback/index.js");
require.alias("ianstormtaylor-callback/index.js", "callback/index.js");
require.alias("timoxley-next-tick/index.js", "ianstormtaylor-callback/deps/next-tick/index.js");

require.alias("ianstormtaylor-is/index.js", "analytics/deps/is/index.js");
require.alias("ianstormtaylor-is/index.js", "is/index.js");
require.alias("component-type/index.js", "ianstormtaylor-is/deps/type/index.js");

require.alias("ianstormtaylor-map/index.js", "analytics/deps/map/index.js");
require.alias("ianstormtaylor-map/index.js", "map/index.js");
require.alias("component-each/index.js", "ianstormtaylor-map/deps/each/index.js");
require.alias("component-to-function/index.js", "component-each/deps/to-function/index.js");

require.alias("component-type/index.js", "component-each/deps/type/index.js");

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

require.alias("analytics/lib/index.js", "analytics/index.js");if (typeof exports == "object") {
  module.exports = require("analytics");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("analytics"); });
} else {
  this["analytics"] = require("analytics");
}})();
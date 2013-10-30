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
  if (options.expires) str += '; expires=' + options.expires.toGMTString();
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
require.register("component-domify/index.js", function(exports, require, module){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  var els = el.children;
  if (1 == els.length) {
    return el.removeChild(els[0]);
  }

  var fragment = document.createDocumentFragment();
  while (els.length) {
    fragment.appendChild(el.removeChild(els[0]));
  }

  return fragment;
}

});
require.register("component-each/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var type = require('type');

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
require.register("component-indexof/index.js", function(exports, require, module){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

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
require.register("component-once/index.js", function(exports, require, module){

/**
 * Identifier.
 */

var n = 0;

/**
 * Global.
 */

var global = (function(){ return this })();

/**
 * Make `fn` callable only once.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

module.exports = function(fn) {
  var id = n++;
  var called;

  function once(){
    // no receiver
    if (this == global) {
      if (called) return;
      called = true;
      return fn.apply(this, arguments);
    }

    // receiver
    var key = '__called_' + id + '__';
    if (this[key]) return;
    this[key] = true;
    return fn.apply(this, arguments);
  }

  return once;
};

});
require.register("component-trim/index.js", function(exports, require, module){

exports = module.exports = trim;

function trim(str){
  if (str.trim) return str.trim();
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  if (str.trimLeft) return str.trimLeft();
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  if (str.trimRight) return str.trimRight();
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
    host: a.host,
    port: a.port,
    hash: a.hash,
    hostname: a.hostname,
    pathname: a.pathname,
    protocol: a.protocol,
    search: a.search,
    query: a.search.slice(1)
  }
};

/**
 * Check if `url` is absolute.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isAbsolute = function(url){
  if (0 == url.indexOf('//')) return true;
  if (~url.indexOf('://')) return true;
  return false;
};

/**
 * Check if `url` is relative.
 *
 * @param {String} url
 * @return {Boolean}
 * @api public
 */

exports.isRelative = function(url){
  return ! exports.isAbsolute(url);
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
  return url.hostname != location.hostname
    || url.port != location.port
    || url.protocol != location.protocol;
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

try {
  var bind = require('bind');
  var type = require('type');
} catch (e) {
  var bind = require('bind-component');
  var type = require('type-component');
}

module.exports = function (obj) {
  for (var key in obj) {
    var val = obj[key];
    if (type(val) === 'function') obj[key] = bind(obj, obj[key]);
  }
  return obj;
};
});
require.register("ianstormtaylor-bind/index.js", function(exports, require, module){

var bind = require('bind')
  , bindAll = require('bind-all');


/**
 * Expose `bind`.
 */

module.exports = exports = bind;


/**
 * Expose `bindAll`.
 */

exports.all = bindAll;


/**
 * Expose `bindMethods`.
 */

exports.methods = bindMethods;


/**
 * Bind `methods` on `obj` to always be called with the `obj` as context.
 *
 * @param {Object} obj
 * @param {String} methods...
 */

function bindMethods (obj, methods) {
  methods = [].slice.call(arguments, 1);
  for (var i = 0, method; method = methods[i]; i++) {
    obj[method] = bind(obj, obj[method]);
  }
  return obj;
}
});
require.register("ianstormtaylor-is-empty/index.js", function(exports, require, module){

/**
 * Expose `isEmpty`.
 */

module.exports = isEmpty;


/**
 * Has.
 */

var has = Object.prototype.hasOwnProperty;


/**
 * Test whether a value is "empty".
 *
 * @param {Mixed} val
 * @return {Boolean}
 */

function isEmpty (val) {
  if (null == val) return true;
  if ('number' == typeof val) return 0 === val;
  if (undefined !== val.length) return 0 === val.length;
  for (var key in val) if (has.call(val, key)) return false;
  return true;
}
});
require.register("ianstormtaylor-is/index.js", function(exports, require, module){

var isEmpty = require('is-empty');

try {
  var typeOf = require('type');
} catch (e) {
  var typeOf = require('component-type');
}


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
 * Add alias for `function` for old browsers.
 */

exports.fn = exports['function'];


/**
 * Expose `empty` check.
 */

exports.empty = isEmpty;


/**
 * Expose `nan` check.
 */

exports.nan = function (val) {
  return exports.number(val) && val != val;
};


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
require.register("jkroso-type/index.js", function(exports, require, module){

/**
 * refs
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(v){
  // .toString() is slow so try avoid it
  return typeof v === 'object'
    ? types[toString.call(v)]
    : typeof v
};

var types = {
  '[object Function]': 'function',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Arguments]': 'arguments',
  '[object Array]': 'array',
  '[object String]': 'string',
  '[object Null]': 'null',
  '[object Undefined]': 'undefined',
  '[object Number]': 'number',
  '[object Boolean]': 'boolean',
  '[object Object]': 'object',
  '[object Text]': 'textnode',
  '[object Uint8Array]': '8bit-array',
  '[object Uint16Array]': '16bit-array',
  '[object Uint32Array]': '32bit-array',
  '[object Uint8ClampedArray]': '8bit-array',
  '[object Error]': 'error'
}

if (typeof window != 'undefined') {
  for (var el in window) if (/^HTML\w+Element$/.test(el)) {
    types['[object '+el+']'] = 'element'
  }
}

module.exports.types = types

});
require.register("jkroso-equals/index.js", function(exports, require, module){

var type = require('type')

/**
 * assert all values are equal
 *
 * @param {Any} [...]
 * @return {Boolean}
 */

module.exports = function(){
	var i = arguments.length - 1
	while (i > 0) {
		if (!compare(arguments[i], arguments[--i])) return false
	}
	return true
}

// (any, any, [array]) -> boolean
function compare(a, b, memos){
	// All identical values are equivalent
	if (a === b) return true
	var fnA = types[type(a)]
	if (fnA !== types[type(b)]) return false
	return fnA ? fnA(a, b, memos) : false
}

var types = {}

// (Number) -> boolean
types.number = function(a){
	// NaN check
	return a !== a
}

// (function, function, array) -> boolean
types['function'] = function(a, b, memos){
	return a.toString() === b.toString()
		// Functions can act as objects
	  && types.object(a, b, memos) 
		&& compare(a.prototype, b.prototype)
}

// (date, date) -> boolean
types.date = function(a, b){
	return +a === +b
}

// (regexp, regexp) -> boolean
types.regexp = function(a, b){
	return a.toString() === b.toString()
}

// (DOMElement, DOMElement) -> boolean
types.element = function(a, b){
	return a.outerHTML === b.outerHTML
}

// (textnode, textnode) -> boolean
types.textnode = function(a, b){
	return a.textContent === b.textContent
}

// decorate `fn` to prevent it re-checking objects
// (function) -> function
function memoGaurd(fn){
	return function(a, b, memos){
		if (!memos) return fn(a, b, [])
		var i = memos.length, memo
		while (memo = memos[--i]) {
			if (memo[0] === a && memo[1] === b) return true
		}
		return fn(a, b, memos)
	}
}

types['arguments'] =
types.array = memoGaurd(compareArrays)

// (array, array, array) -> boolean
function compareArrays(a, b, memos){
	var i = a.length
	if (i !== b.length) return false
	memos.push([a, b])
	while (i--) {
		if (!compare(a[i], b[i], memos)) return false
	}
	return true
}

types.object = memoGaurd(compareObjects)

// (object, object, array) -> boolean
function compareObjects(a, b, memos) {
	var ka = getEnumerableProperties(a)
	var kb = getEnumerableProperties(b)
	var i = ka.length

	// same number of properties
	if (i !== kb.length) return false

	// although not necessarily the same order
	ka.sort()
	kb.sort()

	// cheap key test
	while (i--) if (ka[i] !== kb[i]) return false

	// remember
	memos.push([a, b])

	// iterate again this time doing a thorough check
	i = ka.length
	while (i--) {
		var key = ka[i]
		if (!compare(a[key], b[key], memos)) return false
	}

	return true
}

// (object) -> array
function getEnumerableProperties (object) {
	var result = []
	for (var k in object) if (k !== 'constructor') {
		result.push(k)
	}
	return result
}

// expose compare
module.exports.compare = compare

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

var type = require('type');


/**
 * Expose `alias`.
 */

module.exports = alias;


/**
 * Alias an `object`.
 *
 * @param {Object} obj
 * @param {Mixed} method
 */

function alias (obj, method) {
  switch (type(method)) {
    case 'object': return aliasByDictionary(obj, method);
    case 'function': return aliasByFunction(obj, method);
  }
}


/**
 * Convert the keys in an `obj` using a dictionary of `aliases`.
 *
 * @param {Object} obj
 * @param {Object} aliases
 */

function aliasByDictionary (obj, aliases) {
  for (var key in aliases) {
    if (undefined === obj[key]) continue;
    obj[aliases[key]] = obj[key];
    delete obj[key];
  }
}


/**
 * Convert the keys in an `obj` using a `convert` function.
 *
 * @param {Object} obj
 * @param {Function} convert
 */

function aliasByFunction (obj, convert) {
  for (var key in obj) {
    obj[convert(key)] = obj[key];
    delete obj[key];
  }
}
});
require.register("segmentio-canonical/index.js", function(exports, require, module){
module.exports = function canonical () {
  var tags = document.getElementsByTagName('link');
  for (var i = 0, tag; tag = tags[i]; i++) {
    if ('canonical' == tag.getAttribute('rel')) return tag.getAttribute('href');
  }
};
});
require.register("segmentio-convert-dates/index.js", function(exports, require, module){

var is = require('is');

try {
  var clone = require('clone');
} catch (e) {
  var clone = require('clone-component');
}


/**
 * Expose `convertDates`.
 */

module.exports = convertDates;


/**
 * Recursively convert an `obj`'s dates to new values.
 *
 * @param {Object} obj
 * @param {Function} convert
 * @return {Object}
 */

function convertDates (obj, convert) {
  obj = clone(obj);
  for (var key in obj) {
    var val = obj[key];
    if (is.date(val)) obj[key] = convert(val);
    if (is.object(val)) obj[key] = convertDates(val, convert);
  }
  return obj;
}
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
require.register("segmentio-isodate/index.js", function(exports, require, module){

/**
 * Matcher, slightly modified from:
 *
 * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
 */

var matcher = /^(\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:([ T])(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;


/**
 * Convert an ISO date string to a date. Fallback to native `Date.parse`.
 *
 * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
 *
 * @param {String} iso
 * @return {Date}
 */

exports.parse = function (iso) {
  var numericKeys = [1, 5, 6, 7, 8, 11, 12];
  var arr = matcher.exec(iso);
  var offset = 0;

  // fallback to native parsing
  if (!arr) return new Date(iso);

  // remove undefined values
  for (var i = 0, val; val = numericKeys[i]; i++) {
    arr[val] = parseInt(arr[val], 10) || 0;
  }

  // allow undefined days and months
  arr[2] = parseInt(arr[2], 10) || 1;
  arr[3] = parseInt(arr[3], 10) || 1;

  // month is 0-11
  arr[2]--;

  // allow abitrary sub-second precision
  if (arr[8]) arr[8] = (arr[8] + '00').substring(0, 3);

  // apply timezone if one exists
  if (arr[4] == ' ') {
    offset = new Date().getTimezoneOffset();
  } else if (arr[9] !== 'Z' && arr[10]) {
    offset = arr[11] * 60 + arr[12];
    if ('+' == arr[10]) offset = 0 - offset;
  }

  var millis = Date.UTC(arr[1], arr[2], arr[3], arr[5], arr[6] + offset, arr[7], arr[8]);
  return new Date(millis);
};


/**
 * Checks whether a `string` is an ISO date string. `strict` mode requires that
 * the date string at least have a year, month and date.
 *
 * @param {String} string
 * @param {Boolean} strict
 * @return {Boolean}
 */

exports.is = function (string, strict) {
  if (strict && false === /^\d{4}-\d{2}-\d{2}/.test(string)) return false;
  return matcher.test(string);
};
});
require.register("segmentio-isodate-traverse/index.js", function(exports, require, module){

var clone = require('clone')
  , each = require('each')
  , is = require('is')
  , isodate = require('isodate');


/**
 * Expose `traverse`.
 */

module.exports = traverse;


/**
 * Traverse an object, parsing all ISO strings into dates and returning a clone.
 *
 * @param {Object} obj
 * @return {Object}
 */

function traverse (obj, strict) {
  obj = clone(obj);
  if (strict === undefined) strict = true;
  each(obj, function (key, val) {
    if (isodate.is(val, strict)) {
      obj[key] = isodate.parse(val);
    } else if (is.object(val)) {
      obj[key] = traverse(val);
    }
  });
  return obj;
}
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
            script.addEventListener('load', function (event) {
                callback(null, event);
            }, false);
            script.addEventListener('error', function (event) {
                callback(new Error('Failed to load the script.'), event);
            }, false);
        } else if (script.attachEvent) {
            script.attachEvent('onreadystatechange', function (event) {
                if (/complete|loaded/.test(script.readyState)) {
                    callback(null, event);
                }
            });
        }
    }

    // Return the script element in case they want to do anything special, like
    // give it an ID or attributes.
    return script;
};

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
require.register("component-find/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var toFunction = require('to-function');

/**
 * Find the first value in `arr` with when `fn(val, i)` is truthy.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @return {Array}
 * @api public
 */

module.exports = function(arr, fn){
  // callback
  if ('function' != typeof fn) {
    if (Object(fn) === fn) fn = objectToFunction(fn);
    else fn = toFunction(fn);
  }

  // filter
  for (var i = 0, len = arr.length; i < len; ++i) {
    if (fn(arr[i], i)) return arr[i];
  }
};

/**
 * Convert `obj` into a match function.
 *
 * @param {Object} obj
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  return function(o){
    for (var key in obj) {
      if (o[key] != obj[key]) return false;
    }
    return true;
  }
}
});
require.register("segmentio-memoize-async/index.js", function(exports, require, module){

var nextTick = require('next-tick');


/**
 * Utility methods
 */

var slice = Array.prototype.slice;
var has = Object.hasOwnProperty;


/**
 * Module exports
 */

module.exports = memoize;


/**
 * Memoize a function so it is only called once.
 * @param  {Function} fn
 * @param  {Function} keyFn     how to transform the arguments into a key
 * @return {Function} memoized  the memoized function
 */

function memoize (fn, keyFn) {
  keyFn || (keyFn = function (key) { return key; });

  var cached = {};
  var callbacks = {};

  return function () {
    var args = initial(arguments);
    var cb = last(arguments);
    var key = keyFn.apply(keyFn, args);

    if (has.call(cached, key)) {
      return nextTick(function () { cb.apply(cb, toRes(null, cached[key])); });
    }

    if (has.call(callbacks, key)) return callbacks[key].push(cb);

    callbacks[key] = [];
    callbacks[key].push(cb);

    args.push(onFinish);
    fn.apply(fn, args);

    function onFinish (err) {
      if (!err) cached[key] = rest(arguments); // save our res only on success
      respond(callbacks[key], arguments); // callback
      delete callbacks[key];
    }
  };
}


/**
 * Respond to all of our saved callbacks with the proper args
 * @param  {Array} callbacks
 * @param  {Array} args
 */

function respond (callbacks, args) {
  if (!callbacks) return;

  for (var i = 0; i < callbacks.length; i++) {
    var callback = callbacks[i];
    callback.apply(callback, args);
  }
}


/**
 * Return all but the last argument from the array
 */

function initial (args) {
  return slice.apply(args, [0, -1]);
}


/**
 * Return all but the first argument from the array
 */

function rest (args) {
  return slice.apply(args, [1]);
}


/**
 * Return only the last argument from the array
 */

function last (args) {
  return args[args.length - 1];
}


/**
 * Turn an error and arguments object into a proper callback array
 */

function toRes (err, args) {
  return [err].concat(args);
}

});
require.register("segmentio-load-script-once/index.js", function(exports, require, module){

var debug = require('debug')('load-script-once');
var find = require('find');
var load = require('load-script');
var memoize = require('memoize-async');
var url = require('url');


/**
 * Memoize our load function
 */

load = memoize(load, canonical);


/**
 * Module exports
 */

module.exports = function (options, callback) {
  callback = callback || function () {};

  var src = typeof options === 'string'
    ? options
    : chooseUrl(options);

  if (!src) throw new Error('Could not parse the options!');
  debug('loading: %s', src);

  var scripts = document.getElementsByTagName('script');
  var canonicalized = canonical(src);
  var exists = find(scripts, function (script) {
    return canonical(script.src) === canonicalized;
  });

  if (exists) {
    debug('exists: %s', src);
    return callback();
  }

  load(src, callback);
};


/**
 * Return a 'canonical' version of the url (no querystring or hash).
 *
 * @param {String}  href
 * @return {String} canonical
 */

function canonical (href) {
  var parsed = url.parse(href);
  var canonical = '';
  if (parsed.protocol) canonical += parsed.protocol;
  canonical += '//';
  if (parsed.hostname) canonical += parsed.hostname;
  if (parsed.pathname) canonical += parsed.pathname;
  return canonical;
}


/**
 * Chooses a url from the options passed in
 *
 * @param {Object} options
 *  @field {String} src    src to load from
 *  @field {String} http   http src to load
 *  @field {String} https  https src to load
 */

function chooseUrl (options) {
  var protocol = document.location.protocol;
  var https = protocol === 'https:' ||
              protocol === 'chrome-extension:';

  var protocolSrc = https
    ? options.https
    : options.http;

  var src = options.src || protocolSrc;

  if (src && src.indexOf('//') === 0) {
    return https
      ? 'https:' + src
      : 'http:' + src;
  }

  return src;
}
});
require.register("segmentio-new-date/lib/index.js", function(exports, require, module){

var is = require('is');
var isodate = require('isodate');
var milliseconds = require('./milliseconds');
var seconds = require('./seconds');


/**
 * Returns a new Javascript Date object, allowing a variety of extra input types
 * over the native Date constructor.
 *
 * @param {Date|String|Number} val
 */

module.exports = function newDate (val) {
  if (is.date(val)) return val;
  if (is.number(val)) return new Date(toMs(val));

  // date strings
  if (isodate.is(val)) return isodate.parse(val);
  if (milliseconds.is(val)) return milliseconds.parse(val);
  if (seconds.is(val)) return seconds.parse(val);

  // fallback to Date.parse
  return new Date(val);
};


/**
 * If the number passed val is seconds from the epoch, turn it into milliseconds.
 * Milliseconds would be greater than 31557600000 (December 31, 1970).
 *
 * @param {Number} num
 */

function toMs (num) {
  if (num < 31557600000) return num * 1000;
  return num;
}
});
require.register("segmentio-new-date/lib/milliseconds.js", function(exports, require, module){

/**
 * Matcher.
 */

var matcher = /\d{13}/;


/**
 * Check whether a string is a millisecond date string.
 *
 * @param {String} string
 * @return {Boolean}
 */

exports.is = function (string) {
  return matcher.test(string);
};


/**
 * Convert a millisecond string to a date.
 *
 * @param {String} millis
 * @return {Date}
 */

exports.parse = function (millis) {
  millis = parseInt(millis, 10);
  return new Date(millis);
};
});
require.register("segmentio-new-date/lib/seconds.js", function(exports, require, module){

/**
 * Matcher.
 */

var matcher = /\d{10}/;


/**
 * Check whether a string is a second date string.
 *
 * @param {String} string
 * @return {Boolean}
 */

exports.is = function (string) {
  return matcher.test(string);
};


/**
 * Convert a second string to a date.
 *
 * @param {String} seconds
 * @return {Date}
 */

exports.parse = function (seconds) {
  var millis = parseInt(seconds, 10) * 1000;
  return new Date(millis);
};
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
require.register("segmentio-on-error/index.js", function(exports, require, module){

/**
 * Expose `onError`.
 */

module.exports = onError;


/**
 * Callbacks.
 */

var callbacks = [];


/**
 * Preserve existing handler.
 */

if ('function' == typeof window.onerror) callbacks.push(window.onerror);


/**
 * Bind to `window.onerror`.
 */

window.onerror = handler;


/**
 * Error handler.
 */

function handler () {
  for (var i = 0, fn; fn = callbacks[i]; i++) fn.apply(this, arguments);
}


/**
 * Call a `fn` on `window.onerror`.
 *
 * @param {Function} fn
 */

function onError (fn) {
  callbacks.push(fn);
  if (window.onerror != handler) {
    callbacks.push(window.onerror);
    window.onerror = handler;
  }
}
});
require.register("segmentio-store.js/store.js", function(exports, require, module){
;(function(win){
	var store = {},
		doc = win.document,
		localStorageName = 'localStorage',
		namespace = '__storejs__',
		storage

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
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
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
	if (typeof module != 'undefined' && module.exports) { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { win.store = store }
})(this.window || global);

});
require.register("segmentio-to-unix-timestamp/index.js", function(exports, require, module){

/**
 * Expose `toUnixTimestamp`.
 */

module.exports = toUnixTimestamp;


/**
 * Convert a `date` into a Unix timestamp.
 *
 * @param {Date}
 * @return {Number}
 */

function toUnixTimestamp (date) {
  return Math.floor(date.getTime() / 1000);
}
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
require.register("segmentio-use-https/index.js", function(exports, require, module){

/**
 * Protocol.
 */

var protocol = document.location.protocol;


/**
 * Expose whether they should use `https:` for loading scripts.
 */

module.exports = (
  protocol == 'https:' ||
  protocol == 'chrome-extension'
);
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
require.register("yields-slug/index.js", function(exports, require, module){

/**
 * Generate a slug from the given `str`.
 *
 * example:
 *
 *        generate('foo bar');
 *        // > foo-bar
 *
 * @param {String} str
 * @param {Object} options
 * @config {String|RegExp} [replace] characters to replace, defaulted to `/[^a-z0-9]/g`
 * @config {String} [separator] separator to insert, defaulted to `-`
 * @return {String}
 */

module.exports = function (str, options) {
  options || (options = {});
  return str.toLowerCase()
    .replace(options.replace || /[^a-z0-9]/g, ' ')
    .replace(/^ +| +$/g, '')
    .replace(/ +/g, options.separator || '-')
};

});
require.register("visionmedia-debug/index.js", function(exports, require, module){
if ('undefined' == typeof window) {
  module.exports = require('./lib/debug');
} else {
  module.exports = require('./debug');
}

});
require.register("visionmedia-debug/debug.js", function(exports, require, module){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

});
require.register("analytics/lib/index.js", function(exports, require, module){
/**
 * Analytics.js
 *
 * (C) 2013 Segment.io Inc.
 */

var Analytics = require('./analytics')
  , bind = require('bind');


/**
 * Expose an `analytics` singleton.
 */

module.exports = new Analytics();


/**
 * Bind methods on `analytics` to itself.
 */

bind.methods(
  module.exports,
  'init',
  'initialize',
  'identify',
  'user',
  'group',
  'track',
  'trackClick',
  'trackLink',
  'trackSubmit',
  'trackForm',
  'pageview',
  'alias',
  'ready',
  '_options',
  '_callback',
  '_invoke',
  '_parseQuery'
);
});
require.register("analytics/lib/analytics.js", function(exports, require, module){

var after = require('after')
  , bind = require('event').bind
  , callback = require('callback')
  , canonical = require('canonical')
  , clone = require('clone')
  , cookie = require('./cookie')
  , createIntegration = require('./integration')
  , debug = require('debug')
  , defaults = require('defaults')
  , each = require('each')
  , group = require('./group')
  , Integrations = require('./integrations')
  , is = require('is')
  , isEmail = require('is-email')
  , isMeta = require('is-meta')
  , newDate = require('new-date')
  , prevent = require('prevent')
  , querystring = require('querystring')
  , size = require('object').length
  , store = require('./store')
  , traverse = require('isodate-traverse')
  , url = require('url')
  , user = require('./user');


/**
 * Expose `Analytics`.
 */

module.exports = exports = Analytics;


/**
 * Expose `VERSION`.
 */

exports.VERSION =
Analytics.prototype.VERSION = '0.17.8';


/**
 * Expose `Integrations`.
 */

exports.Integrations =
Analytics.prototype.Integrations = Integrations;


/**
 * Expose `createIntegration`.
 */

exports.createIntegration =
Analytics.prototype.createIntegration = createIntegration;


/**
 * Define a new `Integration`.
 *
 * @param {Function} Integration
 * @return {Analytics}
 */

exports.addIntegration =
Analytics.prototype.addIntegration = function (Integration) {
  var name = Integration.prototype.name;
  Integrations[name] = Integration;
  return this;
};


/**
 * Initialize a new `Analytics` instance.
 */

function Analytics () {
  this._callbacks = [];
  this._integrations = {};
  this._readied = false;
  this._timeout = 300;
  this._user = user; // BACKWARDS COMPATIBILITY
}


/**
 * Initialize with the given integration `settings` and `options`. Aliased to
 * `init` for convenience.
 *
 * @param {Object} settings
 * @param {Object} options (optional)
 * @return {Analytics}
 */

Analytics.prototype.init =
Analytics.prototype.initialize = function (settings, options) {
  settings || (settings = {});
  options || (options = {});

  this._options(options);
  this._readied = false;
  this._integrations = {};

  // load user now that options are set
  user.load();
  group.load();

  // clean unknown integrations from settings
  var self = this;
  each(settings, function (name) {
    var Integration = self.Integrations[name];
    if (!Integration) delete settings[name];
  });

  // make ready callback
  var ready = after(size(settings), function () {
    self._readied = true;
    var callback;
    while (callback = self._callbacks.shift()) callback();
  });

  // initialize integrations, passing ready
  each(settings, function (name, options) {
    var Integration = self.Integrations[name];
    var integration = new Integration(clone(options), ready, self);
    integration.initialize();
    self._integrations[name] = integration;
  });

  // call any querystring methods if present
  this._parseQuery();

  // backwards compat with angular plugin.
  // TODO: remove
  this.initialized = true;

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
  if (is.fn(options)) fn = options, options = undefined;
  if (is.fn(traits)) fn = traits, traits = undefined;
  if (is.object(id)) options = traits, traits = id, id = user.id();

  user.identify(id, traits);

  // clone traits before we manipulate so we don't do anything uncouth, and take
  // from `user` so that we carryover anonymous traits
  id = user.id();
  traits = cleanTraits(id, user.traits());

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
  return user;
};


/**
 * Identify a group by optional `id` and `properties`. Or, if no arguments are
 * supplied, return the current group.
 *
 * @param {String} id (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 * @param {Function} fn (optional)
 * @return {Analytics|Object}
 */

Analytics.prototype.group = function (id, properties, options, fn) {
  if (0 === arguments.length) return group;
  if (is.fn(options)) fn = options, options = undefined;
  if (is.fn(properties)) fn = properties, properties = undefined;
  if (is.object(id)) options = properties, properties = id, id = group.id();

  group.identify(id, properties);

  // grab from group again to make sure we're taking from the source
  id = group.id();
  properties = group.properties();

  // convert a create date to a date
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
  if (is.fn(options)) fn = options, options = undefined;
  if (is.fn(properties)) fn = properties, properties = undefined;

  properties = traverse(clone(properties)) || {};

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
      var ev = is.fn(event) ? event(el) : event;
      var props = is.fn(properties) ? properties(el) : properties;
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

      var ev = is.fn(event) ? event(el) : event;
      var props = is.fn(properties) ? properties(el) : properties;
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
 * Trigger a pageview, labeling the current page with an optional `name` and
 * `properties`.
 *
 * @param {String} name (optional)
 * @param {Object or String} properties (or path) (optional)
 * @param {Object} options (optional)
 * @return {Analytics}
 */

Analytics.prototype.page = function (name, properties, options) {
  if (is.object(name)) options = properties, properties = name, name = undefined;
  if (is.string(properties)) properties = { path: properties };

  properties = clone(properties) || {};
  defaults(properties, {
    path: canonicalPath(),
    referrer: document.referrer,
    title: document.title,
    url: location.href
  });

  this._invoke('page', name, properties, options);
  return this;
};


/**
 * BACKWARDS COMPATIBILITY: convert an old `pageview` to a `page` call.
 *
 * @param {String} url (optional)
 * @param {Object} options (optional)
 * @return {Analytics}
 * @api private
 */

Analytics.prototype.pageview = function (url, options) {
  var properties = {};
  if (url) properties.path = url;
  this.page(properties);
  return this;
};


/**
 * Merge two previously unassociated user identities.
 *
 * @param {String} to
 * @param {String} from
 * @param {Object} options
 * @return {Analytics}
 */

Analytics.prototype.alias = function (to, from, options) {
  if (is.object(from)) options = from, from = undefined;
  this._invoke('alias', to, from, options);
  return this;
};


/**
 * Register a `fn` to be fired when all the analytics services are ready.
 *
 * @param {Function} fn
 * @return {Analytics}
 */

Analytics.prototype.ready = function (fn) {
  if (!is.fn(fn)) return this;
  this._readied
    ? callback.async(fn)
    : this._callbacks.push(fn);
  return this;
};


/**
 * Set the `timeout` (in milliseconds) used for callbacks.
 *
 * @param {Number} timeout
 */

Analytics.prototype.timeout = function (timeout) {
  this._timeout = timeout;
};

/**
 * Enable / disable debug.
 *
 * @param {String|Boolean} str
 */

Analytics.prototype.debug = function(str){
  if (0 == arguments.length || str) {
    debug.enable('analytics:' + (str || '*'));
  } else {
    debug.disable();
  }
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
  store.options(options.localStorage);
  user.options(options.user);
  group.options(options.group);
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
 * Call a `method` on all of initialized integrations, passing clones of arguments
 * along to keep each integration isolated.
 *
 * TODO: check integration enabled
 *
 * @param {String} method
 * @param {Mixed} args...
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._invoke = function (method, args) {
  args = [].slice.call(arguments, 1);
  args.unshift(method);
  var options = args[args.length-1]; // always the last one
  each(this._integrations, function (name, integration) {
    if (!isEnabled(integration, options)) return;
    var clonedArgs = clone(args)
    integration.invoke.apply(integration, clonedArgs);
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
 * Determine whether a `integration` is enabled or not based on `options`.
 *
 * @param {Object} integration
 * @param {Object} options
 * @return {Boolean}
 */

function isEnabled (integration, options) {
  var enabled = true;
  if (!options || !options.providers) return enabled;

  // Default to the 'all' or 'All' setting.
  var map = options.providers;
  if (map.all !== undefined) enabled = map.all;
  if (map.All !== undefined) enabled = map.All;

  // Look for this integration's specific setting.
  var name = integration.name;
  if (map[name] !== undefined) enabled = map[name];

  return enabled;
}


/**
 * Clean up traits, default some useful things both so the user doesn't have to
 * and so we don't have to do it on a integration-basis.
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



/**
 * Return the canonical path for the page.
 *
 * @return {String}
 */

function canonicalPath () {
  var canon = canonical();
  if (!canon) return window.location.pathname;
  var parsed = url.parse(canon);
  return parsed.pathname;
}


});
require.register("analytics/lib/cookie.js", function(exports, require, module){

var bind = require('bind')
  , cookie = require('cookie')
  , clone = require('clone')
  , defaults = require('defaults')
  , json = require('json')
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
 * Expose singleton cookie.
 */

module.exports = bind.all(new Cookie());


/**
 * Expose `Cookie` constructor.
 */

module.exports.Cookie = Cookie;
});
require.register("analytics/lib/group.js", function(exports, require, module){

var debug = require('debug')('analytics:group')
  , bind = require('bind')
  , clone = require('clone')
  , cookie = require('./cookie')
  , defaults = require('defaults')
  , extend = require('extend')
  , store = require('./store')
  , traverse = require('isodate-traverse');


/**
 * Initialize a new `Group`.
 *
 * @param {Object} options
 */

function Group (options) {
  this.options(options);
  this.id(null);
  this.properties({});
}


/**
 * Get or set storage `options`.
 *
 * @param {Object} options
 *   @property {Object} cookie
 *   @property {Object} localStorage
 *   @property {Boolean} persist (default: `true`)
 */

Group.prototype.options = function (options) {
  if (arguments.length === 0) return this._options;
  options || (options = {});

  defaults(options, {
    persist: true,
    cookie: {
      key: 'ajs_group_id'
    },
    localStorage: {
      key: 'ajs_group_properties'
    }
  });

  this._options = options;
};


/**
 * Get or set the group's `id`.
 *
 * @param {String} id
 */

Group.prototype.id = function (id) {
  switch (arguments.length) {
    case 0: return this._getId();
    case 1: return this._setId(id);
  }
};


/**
 * Get the group's id.
 *
 * @return {String}
 */

Group.prototype._getId = function () {
  var ret = this._options.persist
    ? cookie.get(this._options.cookie.key)
    : this._id;
  return ret === undefined ? null : ret;
};


/**
 * Set the group's `id`.
 *
 * @param {String} id
 */

Group.prototype._setId = function (id) {
  if (this._options.persist) {
    cookie.set(this._options.cookie.key, id);
  } else {
    this._id = id;
  }
};


/**
 * Get or set the group's `properties`.
 *
 * @param {String} properties
 */

Group.prototype.properties = function (properties) {
  switch (arguments.length) {
    case 0: return this._getProperties();
    case 1: return this._setProperties(properties);
  }
};


/**
 * Get the group's properties. Always convert ISO date strings into real dates,
 * since they aren't parsed back from local storage.
 *
 * @return {Object}
 */

Group.prototype._getProperties = function () {
  var ret = this._options.persist
    ? store.get(this._options.localStorage.key)
    : this._properties;
  return ret ? traverse(clone(ret)) : {};
};


/**
 * Set the group's `properties`.
 *
 * @param {Object} properties
 */

Group.prototype._setProperties = function (properties) {
  properties || (properties = {});
  if (this._options.persist) {
    store.set(this._options.localStorage.key, properties);
  } else {
    this._properties = properties;
  }
};


/**
 * Idenfity the group with an `id` and `properties`. If we it's the same group,
 * extend the existing `properties` instead of overwriting.
 *
 * @param {String} id
 * @param {Object} properties
 */

Group.prototype.identify = function (id, properties) {
  properties || (properties = {});
  var current = this.id();
  if (current === null || current === id) properties = extend(this.properties(), properties);
  if (id) this.id(id);
  debug('identify %o, %o', id, properties);
  this.properties(properties);
  this.save();
};


/**
 * Save the group to local storage and the cookie.
 *
 * @return {Boolean}
 */

Group.prototype.save = function () {
  if (!this._options.persist) return false;
  cookie.set(this._options.cookie.key, this.id());
  store.set(this._options.localStorage.key, this.properties());
  return true;
};


/**
 * Log the group out, reseting `id` and `properties` to defaults.
 */

Group.prototype.logout = function () {
  this.id(null);
  this.properties({});
  cookie.remove(this._options.cookie.key);
  store.remove(this._options.localStorage.key);
};


/**
 * Reset all group state, logging out and returning options to defaults.
 */

Group.prototype.reset = function () {
  this.logout();
  this.options({});
};


/**
 * Load saved group `id` or `properties` from storage.
 */

Group.prototype.load = function () {
  this.id(cookie.get(this._options.cookie.key));
  this.properties(store.get(this._options.localStorage.key));
};


/**
 * Expose the new group as a singleton.
 */

module.exports = bind.all(new Group());


/**
 * Expose the `Group` constructor.
 */

module.exports.Group = Group;

});
require.register("analytics/lib/integrations.js", function(exports, require, module){

var each = require('each');


/**
 * A list all of our integration slugs.
 */

var integrations = [
  'adroll',
  'amplitude',
  'awesm',
  'awesomatic',
  'bugherd',
  'chartbeat',
  'clicktale',
  'clicky',
  'comscore',
  'crazy-egg',
  'customerio',
  'errorception',
  'foxmetrics',
  'gauges',
  'get-satisfaction',
  'google-analytics',
  'gosquared',
  'heap',
  'hittail',
  'hubspot',
  'improvely',
  'inspectlet',
  'intercom',
  'keen-io',
  'kissmetrics',
  'klaviyo',
  'leadlander',
  'livechat',
  'lytics',
  'mixpanel',
  'mousestats',
  'olark',
  'optimizely',
  'perfect-audience',
  'pingdom',
  'preact',
  'qualaroo',
  'quantcast',
  'rollbar',
  'sentry',
  'snapengage',
  'spinnakr',
  'tapstream',
  'trakio',
  'usercycle',
  'userfox',
  'uservoice',
  'vero',
  'visual-website-optimizer',
  'woopra',
  'yandex-metrica'
];


/**
 * Expose the integrations, using their own `name` from their `prototype`.
 */

each(integrations, function (slug) {
  var Integration = require('./integrations/' + slug);
  exports[Integration.prototype.name] = Integration;
});

});
require.register("analytics/lib/store.js", function(exports, require, module){

var bind = require('bind')
  , defaults = require('defaults')
  , store = require('store');


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
 * Expose a store singleton.
 */

module.exports = bind.all(new Store());


/**
 * Expose the `Store` constructor.
 */

module.exports.Store = Store;
});
require.register("analytics/lib/user.js", function(exports, require, module){

var debug = require('debug')('analytics:user')
  , bind = require('bind')
  , clone = require('clone')
  , cookie = require('./cookie')
  , defaults = require('defaults')
  , extend = require('extend')
  , store = require('./store')
  , traverse = require('isodate-traverse');


/**
 * Initialize a new `User`.
 *
 * @param {Object} options
 */

function User (options) {
  this.options(options);
  this.id(null);
  this.traits({});
}


/**
 * Get or set storage `options`.
 *
 * @param {Object} options
 *   @property {Object} cookie
 *   @property {Object} localStorage
 *   @property {Boolean} persist (default: `true`)
 */

User.prototype.options = function (options) {
  if (arguments.length === 0) return this._options;
  options || (options = {});

  defaults(options, {
    persist: true,
    cookie: {
      key: 'ajs_user_id',
      oldKey: 'ajs_user'
    },
    localStorage: {
      key: 'ajs_user_traits'
    }
  });

  this._options = options;
};


/**
 * Get or set the user's `id`.
 *
 * @param {String} id
 */

User.prototype.id = function (id) {
  switch (arguments.length) {
    case 0: return this._getId();
    case 1: return this._setId(id);
  }
};


/**
 * Get the user's id.
 *
 * @return {String}
 */

User.prototype._getId = function () {
  var ret = this._options.persist
    ? cookie.get(this._options.cookie.key)
    : this._id;
  return ret === undefined ? null : ret;
};


/**
 * Set the user's `id`.
 *
 * @param {String} id
 */

User.prototype._setId = function (id) {
  if (this._options.persist) {
    cookie.set(this._options.cookie.key, id);
  } else {
    this._id = id;
  }
};


/**
 * Get or set the user's `traits`.
 *
 * @param {String} traits
 */

User.prototype.traits = function (traits) {
  switch (arguments.length) {
    case 0: return this._getTraits();
    case 1: return this._setTraits(traits);
  }
};


/**
 * Get the user's traits. Always convert ISO date strings into real dates, since
 * they aren't parsed back from local storage.
 *
 * @return {Object}
 */

User.prototype._getTraits = function () {
  var ret = this._options.persist
    ? store.get(this._options.localStorage.key)
    : this._traits;
  return ret ? traverse(clone(ret)) : {};
};


/**
 * Set the user's `traits`.
 *
 * @param {Object} traits
 */

User.prototype._setTraits = function (traits) {
  traits || (traits = {});
  if (this._options.persist) {
    store.set(this._options.localStorage.key, traits);
  } else {
    this._traits = traits;
  }
};


/**
 * Idenfity the user with an `id` and `traits`. If we it's the same user, extend
 * the existing `traits` instead of overwriting.
 *
 * @param {String} id
 * @param {Object} traits
 */

User.prototype.identify = function (id, traits) {
  traits || (traits = {});
  var current = this.id();
  if (current === null || current === id) traits = extend(this.traits(), traits);
  if (id) this.id(id);
  debug('identify %o, %o', id, traits);
  this.traits(traits);
  this.save();
};


/**
 * Save the user to local storage and the cookie.
 *
 * @return {Boolean}
 */

User.prototype.save = function () {
  if (!this._options.persist) return false;
  cookie.set(this._options.cookie.key, this.id());
  store.set(this._options.localStorage.key, this.traits());
  return true;
};


/**
 * Log the user out, reseting `id` and `traits` to defaults.
 */

User.prototype.logout = function () {
  this.id(null);
  this.traits({});
  cookie.remove(this._options.cookie.key);
  store.remove(this._options.localStorage.key);
};


/**
 * Reset all user state, logging out and returning options to defaults.
 */

User.prototype.reset = function () {
  this.logout();
  this.options({});
};


/**
 * Load saved user `id` or `traits` from storage.
 */

User.prototype.load = function () {
  if (this._loadOldCookie()) return;
  this.id(cookie.get(this._options.cookie.key));
  this.traits(store.get(this._options.localStorage.key));
};


/**
 * BACKWARDS COMPATIBILITY: Load the old user from the cookie.
 *
 * @return {Boolean}
 * @api private
 */

User.prototype._loadOldCookie = function () {
  var user = cookie.get(this._options.cookie.oldKey);
  if (!user) return false;

  this.id(user.id);
  this.traits(user.traits);
  cookie.remove(this._options.cookie.oldKey);
  return true;
};


/**
 * Expose the user singleton.
 */

module.exports = bind.all(new User());


/**
 * Expose the `User` constructor.
 */

module.exports.User = User;

});
require.register("analytics/lib/integration/index.js", function(exports, require, module){

var bind = require('bind');
var callback = require('callback');
var clone = require('clone');
var debug = require('debug');
var defaults = require('defaults');
var protos = require('./protos');
var slug = require('slug');
var statics = require('./statics');


/**
 * Expose `createIntegration`.
 */

module.exports = createIntegration;


/**
 * Create a new Integration constructor.
 *
 * @param {String} name
 */

function createIntegration (name) {

  /**
   * Initialize a new `Integration`.
   *
   * @param {Object} options
   * @param {Function} ready
   * @param {Object} analytics
   */

  function Integration (options, analytics) {
    this.debug = debug('analytics:integration:' + slug(name));
    this.options = defaults(clone(options) || {}, this.defaults);
    this.analytics = analytics;
    this._queue = [];
    this._wrapInitialize();
    this._wrapLoad();
    this._wrapPage();
    this.once('ready', bind(this, this.flush));
  }

  Integration.prototype.defaults = {};
  Integration.prototype.name = name;
  for (var key in statics) Integration[key] = statics[key];
  for (var key in protos) Integration.prototype[key] = protos[key];
  return Integration;
}
});
require.register("analytics/lib/integration/protos.js", function(exports, require, module){

var after = require('after');
var callback = require('callback');
var Emitter = require('emitter');


/**
 * Mixin emitter.
 */

Emitter(exports);


/**
 * Exists noop.
 */

exports.exists = function () {
  return false;
};

/**
 * Initialize noop.
 */

exports.initialize = function () {
  this.load();
};

/**
 * Load noop.
 */

exports.load = function (fn) {
  this.emit('ready');
  callback.async(fn);
};

/**
 * Invoke a `method` that may or may not exist on the prototype with `args`,
 * queueing or not depending on whether the integration is "ready". Don't
 * trust the method call, since it contains integration party code.
 *
 * @param {String} method
 * @param {Mixed} args...
 * @api private
 */

exports.invoke = function (method) {
  if (!this[method]) return;
  var args = [].slice.call(arguments, 1);
  if (!this._ready) return this.queue(method, args);

  try {
    this.debug('%s with %o', method, args);
    this[method].apply(this, args);
  } catch (e) {
    this.debug('error %o calling %s with %o', e, method, args);
  }
};

/**
 * Queue a `method` with `args`. If the integration assumes an initial
 * pageview, then let the first call to `page` pass through to `initialize`.
 *
 * @param {String} method
 * @param {Array} args
 * @api private
 */

exports.queue = function (method, args) {
  if ('page' == method && this._assumesPageview && !this._initialized) {
    this._initialized = true;
    return this.initialize();
  }

  this._queue.push({ method: method, args: args });
};


/**
 * Flush the internal queue.
 *
 * @api private
 */

exports.flush = function () {
  var call;
  while (call = this._queue.shift()) this[call.method].apply(this, call.args);
};


/**
 * Wrap the initialize method in an exists check, so we don't have to do it for
 * every single integration.
 *
 * @api private
 */

exports._wrapInitialize = function () {
  var initialize = this.initialize;
  this.initialize = function () {
    if (this.exists()) {
      this.debug('already loaded');
      this.emit('ready');
      return;
    }

    initialize.apply(this, arguments);
    if (this._readyOnInitialize) this.emit('ready');
  };
};


/**
 * Wrap the load method in `debug` calls, so every integration gets them
 * automatically.
 *
 * @api private
 */

exports._wrapLoad = function () {
  var load = this.load;
  this.load = function (callback) {
    var self = this;
    this.debug('loading');
    load.call(this, function (err, e) {
      self.debug('loaded');
      self.emit('load');
      if (self._readyOnLoad) self.emit('ready');
      callback && callback(err, e);
    });
  };
};


/**
 * BACKWARDS COMPATIBILITY: Wrap the page method if the old `initialPageview`
 * option was set to `false`.
 *
 * @api private
 */

exports._wrapPage = function () {
  if (this.options.initialPageview === false) {
    this.prototype.page = after(1, this.prototype.page);
  }
};
});
require.register("analytics/lib/integration/statics.js", function(exports, require, module){

var after = require('after');


/**
 * Add a new option to the integration by `key` with default `value`.
 *
 * @param {String} key
 * @param {Mixed} value
 * @return {Integration}
 */

exports.option = function (key, value) {
  this.prototype.defaults[key] = value;
  return this;
};


/**
 * Mark the integration as assuming an initial pageview, so to defer loading
 * the script until the first `page` call, noop the first `initialize`.
 *
 * @return {Integration}
 */

exports.assumesPageview = function () {
  this.prototype._assumesPageview = true;
  this.prototype.initialize = after(1, this.prototype.initialize);
  return this;
};


/**
 * Mark the integration as being "ready" once `load` is called.
 *
 * @return {Integration}
 */

exports.readyOnLoad = function () {
  this.prototype._readyOnLoad = true;
  return this;
};


/**
 * Mark the integration as being "ready" once `load` is called.
 *
 * @return {Integration}
 */

exports.readyOnInitialize = function () {
  this.prototype._readyOnInitialize = true;
  return this;
};
});
require.register("analytics/lib/integrations/adroll.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script');
var user = require('../user');


/**
 * Expose `AdRoll`.
 */

var AdRoll = module.exports = integration('AdRoll')
  .assumesPageview()
  .readyOnLoad()
  .option('advId', '')
  .option('pixId', '');


/**
 * Exists?
 */

AdRoll.prototype.exists = function () {
  return !! window.__adroll_loaded;
};


/**
 * Initialize.
 *
 * http://support.adroll.com/getting-started-in-4-easy-steps/#step-one
 * http://support.adroll.com/enhanced-conversion-tracking/
 */

AdRoll.prototype.initialize = function () {
  var options = this.options;
  var id = user.id();
  var traits = user.traits();
  if (id) traits.id = id;

  window.adroll_adv_id = options.advId;
  window.adroll_pix_id = options.pixId;
  window.adroll_custom_data = traits;
  window.__adroll_loaded = true;
  this.load();
};


/**
 * Load the AdRoll script.
 *
 * @param {Function} callback
 */

AdRoll.prototype.load = function (callback) {
  load({
    http: 'http://a.adroll.com/j/roundtrip.js',
    https: 'https://s.adroll.com/j/roundtrip.js'
  }, callback);
};
});
require.register("analytics/lib/integrations/amplitude.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `Amplitude`.
 */

var Amplitude = module.exports = integration('Amplitude')
  .assumesPageview()
  .readyOnInitialize()
  .option('apiKey', '')
  .option('trackAllPages', false)
  .option('trackNamedPages', true);


/**
 * Exists?
 */

Amplitude.prototype.exists = function () {
  return !! window.amplitude;
};


/**
 * Initialize.
 *
 * https://github.com/amplitude/Amplitude-Javascript
 */

Amplitude.prototype.initialize = function () {
  (function(e,t){var r=e.amplitude||{}; r._q=[];function i(e){r[e]=function(){r._q.push([e].concat(Array.prototype.slice.call(arguments,0)));};} var s=["init","logEvent","setUserId","setGlobalUserProperties","setVersionName"]; for(var c=0;c<s.length;c++){i(s[c]);}e.amplitude=r;})(window,document);
  window.amplitude.init(this.options.apiKey);
  this.load();
};


/**
 * Load the Amplitude library.
 *
 * @param {Function} callback
 */

Amplitude.prototype.load = function (callback) {
  load('https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-1.0-min.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Amplitude.prototype.identify = function (id, traits, options) {
  if (id) window.amplitude.setUserId(id);
  if (traits) window.amplitude.setGlobalUserProperties(traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Amplitude.prototype.track = function (event, properties, options) {
  window.amplitude.logEvent(event, properties);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Amplitude.prototype.page = function (name, properties, options) {
  // named pages
  if (this.options.trackNamedPages && name) {
    this.track('Viewed ' + name + ' Page', properties);
  }

  // all pages
  if (this.options.trackAllPages) {
    this.track('Loaded a Page', properties);
  }
};
});
require.register("analytics/lib/integrations/awesm.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script');
var user = require('../user');


/**
 * Expose `Awesm`.
 */

var Awesm = module.exports = integration('awe.sm')
  .assumesPageview()
  .readyOnLoad()
  .option('apiKey', '')
  .option('events', {});


/**
 * Exists?
 */

Awesm.prototype.exists = function () {
  return !! window.AWESM;
};


/**
 * Initialize.
 *
 * http://developers.awe.sm/guides/javascript/
 */

Awesm.prototype.initialize = function () {
  window.AWESM = { api_key: this.options.apiKey };
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Awesm.prototype.load = function (callback) {
  var key = this.options.apiKey;
  load('//widgets.awe.sm/v3/widgets.js?key=' + key + '&async=true', callback);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Awesm.prototype.track = function (event, properties, options) {
  var goal = this.options.events[event];
  if (!goal) return;
  var value = properties.value || 0;
  if (properties.revenue) value = properties.revenue * 100; // prefer revenue
  window.AWESM.convert(goal, value, null, user.id());
};
});
require.register("analytics/lib/integrations/awesomatic.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script');
var noop = function(){};
var onBody = require('on-body');


/**
 * Expose `Awesomatic`.
 */

var Awesomatic = module.exports = integration('Awesomatic')
  .assumesPageview()
  .option('appId', '');


/**
 * Exists?
 */

Awesomatic.prototype.exists = function () {
  return !! window.Awesomatic;
};


/**
 * Initialize.
 */

Awesomatic.prototype.initialize = function () {
  var self = this;
  var id = this.options.appId;
  this.load(function () {
    window.Awesomatic.initialize({ appId: id }, function () {
      self.emit('ready');
    });
  });
};


/**
 * Load the Awesomatic library.
 *
 * @param {Function} callback
 */

Awesomatic.prototype.load = function (callback) {
  var url = 'https://1c817b7a15b6941337c0-dff9b5f4adb7ba28259631e99c3f3691.ssl.cf2.rackcdn.com/gen/embed.js';
  load(url, callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Awesomatic.prototype.identify = function (id, traits, options) {
  if (!id && !traits.email) return;
  if (id) traits.userId = id;
  window.Awesomatic.load(traits);
};
});
require.register("analytics/lib/integrations/bugherd.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `BugHerd`.
 */

var BugHerd = module.exports = integration('BugHerd')
  .assumesPageview()
  .readyOnLoad()
  .option('apiKey', '')
  .option('showFeedbackTab', true);


/**
 * Exists?
 */

BugHerd.prototype.exists = function () {
  return !! window.BugHerdConfig;
};


/**
 * Initialize.
 *
 * http://support.bugherd.com/home
 */

BugHerd.prototype.initialize = function () {
  window.BugHerdConfig = { feedback: { hide: !this.options.showFeedbackTab }};
  this.load();
};


/**
 * Load the BugHerd library.
 *
 * @param {Function} callback
 */

BugHerd.prototype.load = function (callback) {
  load('//www.bugherd.com/sidebarv2.js?apikey=' + this.options.apiKey, callback);
};
});
require.register("analytics/lib/integrations/chartbeat.js", function(exports, require, module){

var integration = require('../integration');
var onBody = require('on-body');
var load = require('load-script');


/**
 * Expose `Chartbeat`.
 */

var Chartbeat = module.exports = integration('Chartbeat')
  .assumesPageview()
  .readyOnLoad()
  .option('domain', '')
  .option('uid', null);


/**
 * Exists?
 */

Chartbeat.prototype.exists = function () {
  return !! window._sf_async_config;
};


/**
 * Initialize.
 *
 * http://chartbeat.com/docs/configuration_variables/
 */

Chartbeat.prototype.initialize = function () {
  window._sf_async_config = this.options;
  onBody(function () { window._sf_endpt = new Date().getTime(); });
  this.load();
};


/**
 * Load the Chartbeat library.
 *
 * http://chartbeat.com/docs/adding_the_code/
 *
 * @param {Function} callback
 */

Chartbeat.prototype.load = function (callback) {
  load({
    https: 'https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/js/chartbeat.js',
    http: 'http://static.chartbeat.com/js/chartbeat.js'
  }, callback);
};


/**
 * Page.
 *
 * http://chartbeat.com/docs/handling_virtual_page_changes/
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Chartbeat.prototype.page = function (name, properties, options) {
  window.pSUPERFLY.virtualPage(properties.path, name || properties.title);
};
});
require.register("analytics/lib/integrations/clicktale.js", function(exports, require, module){

var date = require('load-date');
var domify = require('domify');
var each = require('each');
var integration = require('../integration');
var useHttps = require('use-https');
var load = require('load-script');
var onBody = require('on-body');


/**
 * Expose `ClickTale`.
 */

var ClickTale = module.exports = integration('ClickTale')
  .assumesPageview()
  .readyOnLoad()
  .option('httpCdnUrl', 'http://s.clicktale.net/WRe0.js')
  .option('httpsCdnUrl', '')
  .option('projectId', '')
  .option('recordingRatio', 0.01)
  .option('partitionId', '');


/**
 * Exists?
 */

ClickTale.prototype.exists = function () {
  return !! window.WRInitTime;
};


/**
 * Initialize.
 *
 * http://wiki.clicktale.com/Article/JavaScript_API
 */

ClickTale.prototype.initialize = function () {
  var options = this.options;
  window.WRInitTime = date.getTime();

  onBody(function (body) {
    body.appendChild(domify('<div id="ClickTaleDiv" style="display: none;">'));
  });

  this.load(function () {
    window.ClickTale(options.projectId, options.recordingRatio, options.partitionId);
  });
};


/**
 * Load the ClickTale library.
 *
 * @param {Function} callback
 */

ClickTale.prototype.load = function (callback) {
  var http = this.options.httpCdnUrl;
  var https = this.options.httpsCdnUrl;
  if (useHttps && !https) return this.debug('https option required');
  load({ http: http, https: https }, callback);
};


/**
 * Identify.
 *
 * http://wiki.clicktale.com/Article/ClickTaleTag#ClickTaleSetUID
 * http://wiki.clicktale.com/Article/ClickTaleTag#ClickTaleField
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

ClickTale.prototype.identify = function (id, traits, options) {
  window.ClickTaleSetUID(id);
  each(traits, function (key, value) {
    window.ClickTaleField(key, value);
  });
};


/**
 * Track.
 *
 * http://wiki.clicktale.com/Article/ClickTaleTag#ClickTaleEvent
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

ClickTale.prototype.track = function (event, properties, options) {
  window.ClickTaleEvent(event);
};
});
require.register("analytics/lib/integrations/clicky.js", function(exports, require, module){

var extend = require('extend');
var integration = require('../integration');
var load = require('load-script');
var user = require('../user');


/**
 * Expose `Clicky`.
 */

var Clicky = module.exports = integration('Clicky')
  .assumesPageview()
  .readyOnLoad()
  .option('siteId', null);


/**
 * Exists?
 */

Clicky.prototype.exists = function () {
  return !! window.clicky_site_ids;
};


/**
 * Initialize.
 *
 * http://clicky.com/help/customization
 */

Clicky.prototype.initialize = function () {
  window.clicky_site_ids = [this.options.siteId];
  this.identify(user.id(), user.traits());
  this.load();
};


/**
 * Load the Clicky library.
 *
 * @param {Function} callback
 */

Clicky.prototype.load = function (callback) {
  load('//static.getclicky.com/js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Clicky.prototype.identify = function (id, traits, options) {
  window.clicky_custom = window.clicky_custom || {};
  window.clicky_custom.session = window.clicky_custom.session || {};
  if (id) traits.id = id;
  extend(window.clicky_custom.session, traits);
};


/**
 * Track.
 *
 * http://clicky.com/help/customization#/help/custom/manual
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Clicky.prototype.track = function (event, properties, options) {
  window.clicky.goal(event, properties.revenue);
};


/**
 * Page.
 *
 * http://clicky.com/help/customization#/help/custom/manual
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Clicky.prototype.page = function (name, properties, options) {
  window.clicky.log(properties.path, name || properties.title);
};
});
require.register("analytics/lib/integrations/comscore.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `Comscore`.
 */

var Comscore = module.exports = integration('Comscore')
  .assumesPageview()
  .readyOnLoad()
  .option('c1', '2')
  .option('c2', '');


/**
 * Exists?
 */

Comscore.prototype.exists = function () {
  return !! window._comscore;
};


/**
 * Initialize.
 */

Comscore.prototype.initialize = function () {
  window._comscore = [this.options];
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Comscore.prototype.load = function (callback) {
  load({
    http: 'http://b.scorecardresearch.com/beacon.js',
    https: 'https://sb.scorecardresearch.com/beacon.js'
  }, callback);
};
});
require.register("analytics/lib/integrations/crazy-egg.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `CrazyEgg`.
 */

var CrazyEgg = module.exports = integration('Crazy Egg')
  .assumesPageview()
  .readyOnLoad()
  .option('accountNumber', '');


/**
 * Exists?
 */

CrazyEgg.prototype.exists = function () {
  return !! window.CE2;
};


/**
 * Initialize.
 */

CrazyEgg.prototype.initialize = function () {
  this.load();
};


/**
 * Load the Crazy Egg library.
 *
 * @param {Function} callback
 */

CrazyEgg.prototype.load = function (callback) {
  var number = this.options.accountNumber;
  var path = number.slice(0,4) + '/' + number.slice(4);
  var cache = Math.floor(new Date().getTime()/3600000);
  var url = '//dnn506yrbagrg.cloudfront.net/pages/scripts/' + path + '.js?' + cache;
  load(url, callback);
};
});
require.register("analytics/lib/integrations/customerio.js", function(exports, require, module){

var alias = require('alias');
var callback = require('callback');
var convertDates = require('convert-dates');
var integration = require('../integration');
var load = require('load-script');
var user = require('../user');


/**
 * Expose `Customerio`.
 */

var Customerio = module.exports = integration('Customer.io')
  .assumesPageview()
  .readyOnInitialize()
  .option('siteId', '');


/**
 * Exists?
 */

Customerio.prototype.exists = function () {
  return !! window._cio;
};


/**
 * Initialize.
 *
 * http://customer.io/docs/api/javascript.html
 */

Customerio.prototype.initialize = function () {
  var _cio = window._cio = [];
  (function() {var a,b,c; a = function (f) {return function () {_cio.push([f].concat(Array.prototype.slice.call(arguments,0))); }; }; b = ['identify', 'track']; for (c = 0; c < b.length; c++) {_cio[b[c]] = a(b[c]); } })();
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Customerio.prototype.load = function (callback) {
  var script = load('https://assets.customer.io/assets/track.js', callback);
  script.id = 'cio-tracker';
  script.setAttribute('data-site-id', this.options.siteId);
};


/**
 * Trait aliases.
 */

var traitAliases = {
  created: 'created_at'
};


/**
 * Identify.
 *
 * http://customer.io/docs/api/javascript.html#section-Identify_customers
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Customerio.prototype.identify = function (id, traits, options) {
  if (!id) return this.debug('user id required');
  traits.id = id;
  traits = convertDates(traits, convertDate);
  traits = alias(traits, traitAliases);
  window._cio.identify(traits);
};


/**
 * Group.
 *
 * @param {String} id (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Customerio.prototype.group = function (id, properties, options) {
  if (id) properties.id = id;
  properties = alias(properties, function (prop) {
    return 'Group ' + prop;
  });

  this.identify(user.id(), properties);
};


/**
 * Track.
 *
 * http://customer.io/docs/api/javascript.html#section-Track_a_custom_event
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Customerio.prototype.track = function (event, properties, options) {
  properties = convertDates(properties, convertDate);
  window._cio.track(event, properties);
};


/**
 * Convert a date to the format Customer.io supports.
 *
 * @param {Date} date
 * @return {Number}
 */

function convertDate (date) {
  return Math.floor(date.getTime() / 1000);
}
});
require.register("analytics/lib/integrations/errorception.js", function(exports, require, module){

var callback = require('callback');
var extend = require('extend');
var integration = require('../integration');
var load = require('load-script-once');
var onError = require('on-error');


/**
 * Expose `Errorception`.
 */

var Errorception = module.exports = integration('Errorception')
  .readyOnInitialize()
  .option('projectId', '')
  .option('meta', true);


/**
 * Exists?
 */

Errorception.prototype.exists = function () {
  return !! window._errs;
};


/**
 * Initialize.
 *
 * https://github.com/amplitude/Errorception-Javascript
 */

Errorception.prototype.initialize = function () {
  window._errs = [this.options.projectId];
  onError(function() { window._errs.push(arguments); });
  this.load();
};


/**
 * Load the Errorception library.
 *
 * @param {Function} callback
 */

Errorception.prototype.load = function (callback) {
  load('//beacon.errorception.com/' + this.options.projectId + '.js', callback);
};


/**
 * Identify.
 *
 * http://blog.errorception.com/2012/11/capture-custom-data-with-your-errors.html
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Errorception.prototype.identify = function (id, traits, options) {
  if (!this.options.meta) return;
  if (id) traits.id = id;
  window._errs.meta = window._errs.meta || {};
  extend(window._errs.meta, traits);
};
});
require.register("analytics/lib/integrations/foxmetrics.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `FoxMetrics`.
 */

var FoxMetrics = module.exports = integration('FoxMetrics')
  .assumesPageview()
  .readyOnInitialize()
  .option('appId', '');


/**
 * Exists?
 */

FoxMetrics.prototype.exists = function () {
  return !! window._fxm;
};


/**
 * Initialize.
 *
 * http://foxmetrics.com/documentation/apijavascript
 */

FoxMetrics.prototype.initialize = function () {
  window._fxm = [];
  this.load();
};


/**
 * Load the FoxMetrics library.
 *
 * @param {Function} callback
 */

FoxMetrics.prototype.load = function (callback) {
  var id = this.options.appId;
  load('//d35tca7vmefkrc.cloudfront.net/scripts/' + id + '.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

FoxMetrics.prototype.identify = function (id, traits, options) {
  if (!id) return; // foxmetrics requires an `id`

  // foxmetrics needs the first and last name separately
  // TODO: remove when we have facade
  var firstName = traits.firstName;
  var lastName = traits.lastName;
  if (!firstName && traits.name) firstName = traits.name.split(' ')[0];
  if (!lastName && traits.name) lastName = traits.name.split(' ')[1];

  push(
    '_fxm.visitor.profile',
    id,             // user id
    firstName,      // first name
    lastName,       // last name
    traits.email,   // email
    traits.address, // address
    undefined,      // social
    undefined,      // partners
    traits          // attributes
  );
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

FoxMetrics.prototype.track = function (event, properties, options) {
  push(
    event,               // event name
    properties.category, // category
    properties           // properties
  );
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

FoxMetrics.prototype.page = function (name, properties, options) {
  push(
    '_fxm.pages.view',
    properties.title,   // title
    name,               // name
    undefined,          // category
    properties.url,     // url
    properties.referrer // referrer
  );
};


/**
 * Helper to push onto the FoxMetrics queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._fxm.push(args);
}
});
require.register("analytics/lib/integrations/gauges.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Gauges`.
 */

var Gauges = module.exports = integration('Gauges')
  .assumesPageview()
  .readyOnInitialize()
  .option('siteId', '');


/**
 * Exists?
 */

Gauges.prototype.exists = function () {
  return !! window._gauges;
};


/**
 * Initialize Gauges.
 *
 * http://get.gaug.es/documentation/tracking/
 */

Gauges.prototype.initialize = function () {
  window._gauges = [];
  this.load();
};


/**
 * Load the Gauges library.
 *
 * @param {Function} callback
 */

Gauges.prototype.load = function (callback) {
  var id = this.options.siteId;
  var script = load('//secure.gaug.es/track.js', callback);
  script.id = 'gauges-tracker';
  script.setAttribute('data-site-id', id);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Gauges.prototype.page = function (name, properties, options) {
  window._gauges.push(['track']);
};
});
require.register("analytics/lib/integrations/get-satisfaction.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script-once');
var onBody = require('on-body');


/**
 * Expose `GetSatisfaction`.
 */

var GetSatisfaction = module.exports = integration('Get Satisfaction')
  .assumesPageview()
  .readyOnLoad()
  .option('widgetId', '');


/**
 * Exists?
 */

GetSatisfaction.prototype.exists = function () {
  return !! window.GSFN;
};


/**
 * Initialize.
 *
 * https://console.getsatisfaction.com/start/101022?signup=true#engage
 */

GetSatisfaction.prototype.initialize = function () {
  var widget = this.options.widgetId;
  var div = document.createElement('div');
  var id = div.id = 'getsat-widget-' + widget;
  onBody(function (body) { body.appendChild(div); });

  // usually the snippet is sync, so wait for it before initializing the tab
  this.load(function () {
    window.GSFN.loadWidget(widget, { containerId: id });
  });
};


/**
 * Load the Get Satisfaction library.
 *
 * @param {Function} callback
 */

GetSatisfaction.prototype.load = function (callback) {
  load('https://loader.engage.gsfn.us/loader.js', callback);
};
});
require.register("analytics/lib/integrations/google-analytics.js", function(exports, require, module){

var callback = require('callback');
var canonical = require('canonical');
var each = require('each');
var integration = require('../integration');
var is = require('is');
var load = require('load-script-once');
var type = require('type');
var url = require('url');


/**
 * Expose `GA`.
 *
 * http://support.google.com/analytics/bin/answer.py?hl=en&answer=2558867
 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate
 */

var GA = module.exports = integration('Google Analytics')
  .readyOnLoad()
  .option('anonymizeIp', false)
  .option('classic', false)
  .option('domain', 'none')
  .option('doubleClick', false)
  .option('enhancedLinkAttribution', false)
  .option('ignoreReferrer', null)
  .option('siteSpeedSampleRate', null)
  .option('trackingId', '')
  .option('trackNamedPages', true);


/**
 * Exists?
 */

GA.prototype.exists = function () {
  return !! window.ga || window._gaq || window.GoogleAnalyticsObject;
};


/**
 * Initialize.
 *
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced
 */

GA.prototype.initialize = function () {
  var options = this.options;

  if (options.classic) {
    this.load = this.loadClassic;
    this.track = this.trackClassic;
    this.page = this.pageClassic;
    return this.initializeClassic();
  }

  // setup the tracker globals
  window.GoogleAnalyticsObject = 'ga';
  window.ga || (window.ga = function () {
    window.ga.q || (window.ga.q = []);
    window.ga.q.push(arguments);
  });
  window.ga.l = new Date().getTime();

  // anonymize before initializing
  if (options.anonymizeIp) window.ga('set', 'anonymizeIp', true);

  // initialize
  window.ga('create', options.trackingId, {
    cookieDomain: options.domain,
    siteSpeedSampleRate: options.siteSpeedSampleRate,
    allowLinker: true
  });

  this.load();
};


/**
 * Load the Google Analytics library.
 *
 * @param {Function} callback
 */

GA.prototype.load = function (callback) {
  load('//www.google-analytics.com/analytics.js', callback);
};


/**
 * Track.
 *
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GA.prototype.track = function (event, properties, options) {
  options = options || {};
  window.ga('send', 'event', {
    eventAction: event,
    eventCategory: properties.category || 'All',
    eventLabel: properties.label,
    eventValue: formatValue(properties.value || properties.revenue),
    nonInteraction: properties.noninteraction || options.noninteraction
  });
};


/**
 * Page.
 *
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GA.prototype.page = function (name, properties, options) {
  window.ga('send', 'pageview', {
    page: properties.path,
    title: name || properties.title,
    url: properties.url
  });

  if (name && this.options.trackNamedPages) {
    this.track('Viewed ' + name + ' Page', properties);
  }
};


/**
 * Initialize (classic).
 *
 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration
 */

GA.prototype.initializeClassic = function () {
  var options = this.options;
  window._gaq = window._gaq || [];
  push('_setAccount', options.trackingId);
  push('_setAllowLinker', true);

  var anonymize = options.anonymizeIp;
  var db = options.doubleClick;
  var domain = options.domain;
  var enhanced = options.enhancedLinkAttribution;
  var ignore = options.ignoreReferrer;
  var initial = options.initialPageview;
  var sample = options.siteSpeedSampleRate;

  if (anonymize) push('_gat._anonymizeIp');
  if (domain) push('_setDomainName', domain);
  if (sample) push('_setSiteSpeedSampleRate', sample);

  if (enhanced) {
    var protocol = 'https:' === document.location.protocol ? 'https:' : 'http:';
    var pluginUrl = protocol + '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
    push('_require', 'inpage_linkid', pluginUrl);
  }

  if (ignore) {
    if (!is.array(ignore)) ignore = [ignore];
    each(ignore, function (domain) {
      push('_addIgnoredRef', domain);
    });
  }

  if (initial) {
    var path, canon = canonical();
    if (canon) path = url.parse(canon).pathname;
    this.pageview(path);
  }

  this.load();
};


/**
 * Load the classic Google Analytics library.
 *
 * @param {Function} callback
 */

GA.prototype.loadClassic = function (callback) {
  if (this.options.doubleClick) {
    load('//stats.g.doubleclick.net/dc.js', callback);
  } else {
    load({
      http: 'http://www.google-analytics.com/ga.js',
      https: 'https://ssl.google-analytics.com/ga.js'
    }, callback);
  }
};


/**
 * Track (classic).
 *
 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEventTracking
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GA.prototype.trackClassic = function (event, properties, options) {
  options || (options = {});
  var category = properties.category || 'All';
  var label = properties.label;
  var value = formatValue(properties.revenue || properties.value);
  var noninteraction = properties.noninteraction || options.noninteraction;

  push('_trackEvent', category, event, label, value, noninteraction);
};


/**
 * Page (classic).
 *
 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GA.prototype.pageClassic = function (name, properties, options) {
  push('_trackPageview', properties.path);

  if (name && this.options.trackNamedPages) {
    this.track('Viewed ' + name + ' Page', properties);
  }
};


/**
 * Helper to push onto the classic Google Analytics queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._gaq.push(args);
}


/**
 * Format the value property to Google's liking.
 *
 * @param {Number} value
 * @return {Number}
 */

function formatValue (value) {
  if (!value || value < 0) return 0;
  return Math.round(value);
}

});
require.register("analytics/lib/integrations/gosquared.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');
var onBody = require('on-body');
var user = require('../user');


/**
 * Expose `GoSquared`.
 */

var GoSquared = module.exports = integration('GoSquared')
  .assumesPageview()
  .readyOnLoad()
  .option('siteToken', '');


/**
 * Exists?
 */

GoSquared.prototype.exists = function () {
  return !! window.GoSquared;
};


/**
 * Initialize.
 *
 * http://www.gosquared.com/support
 */

GoSquared.prototype.initialize = function () {
  var self = this;
  var options = this.options;

  // gosquared assumes a body in their script, so we need this wrapper
  onBody(function () {
    window.GoSquared = {};
    window.GoSquared.acct = options.siteToken;
    window.GoSquared.q = [];
    window._gstc_lt = new Date().getTime(); // time from `load`

    self.identify(user.id(), user.traits());
    self.load();
  });
};


/**
 * Load the GoSquared library.
 *
 * @param {Function} callback
 */

GoSquared.prototype.load = function (callback) {
  load('//d1l6p2sc9645hc.cloudfront.net/tracker.js', callback);
};


/**
 * Identify.
 *
 * https://www.gosquared.com/customer/portal/articles/612063-tracker-functions
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

GoSquared.prototype.identify = function (id, traits, options) {
  window.GoSquared.UserName = id;
  window.GoSquared.VisitorName = traits.email || traits.username || id;
  if (id) traits.userID = id; // gosquared recognizes this in `Visitor`
  window.GoSquared.Visitor = traits;
};


/**
 * Track.
 *
 * https://www.gosquared.com/customer/portal/articles/609683-event-tracking
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GoSquared.prototype.track = function (event, properties, options) {
  push('TrackEvent', event, properties);
};


/**
 * Page.
 *
 * https://www.gosquared.com/customer/portal/articles/612063-tracker-functions
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GoSquared.prototype.page = function (name, properties, options) {
  push('TrackView', properties.path, name || properties.title);
};


/**
 * Helper to push onto the GoSquared queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window.GoSquared.q.push(args);
}
});
require.register("analytics/lib/integrations/heap.js", function(exports, require, module){

var alias = require('alias');
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Heap`.
 */

var Heap = module.exports = integration('Heap')
  .assumesPageview()
  .readyOnInitialize()
  .option('apiKey', '');


/**
 * Exists?
 */

Heap.prototype.exists = function () {
  return !! window.heap;
};


/**
 * Initialize.
 *
 * https://heapanalytics.com/docs#installWeb
 */

Heap.prototype.initialize = function () {
  window.heap=window.heap||[];window.heap.load=function(a){window._heapid=a;var d=function(a){return function(){window.heap.push([a].concat(Array.prototype.slice.call(arguments,0)));};},e=["identify","track"];for(var f=0;f<e.length;f++);window.heap[e[f]]=d(e[f]);};
  window.heap.load(this.options.apiKey);
  this.load();
};


/**
 * Load the Heap library.
 *
 * @param {Function} callback
 */

Heap.prototype.load = function (callback) {
  load('//d36lvucg9kzous.cloudfront.net', callback);
};


/**
 * Trait aliases.
 */

var traitAliases = {
  username: 'handle'
};


/**
 * Identify.
 *
 * https://heapanalytics.com/docs#identify
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Heap.prototype.identify = function (id, traits, options) {
  traits = alias(traits, traitAliases);
  window.heap.identify(traits);
};


/**
 * Track.
 *
 * https://heapanalytics.com/docs#track
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Heap.prototype.track = function (event, properties, options) {
  window.heap.track(event, properties);
};
});
require.register("analytics/lib/integrations/hittail.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `HitTail`.
 */

var HitTail = module.exports = integration('HitTail')
  .assumesPageview()
  .readyOnLoad()
  .option('siteId', '');


/**
 * Exists?
 */

HitTail.prototype.exists = function () {
  return !! window.htk;
};


/**
 * Initialize.
 */

HitTail.prototype.initialize = function () {
  this.load();
};


/**
 * Load the HitTail library.
 *
 * @param {Function} callback
 */

HitTail.prototype.load = function (callback) {
  var id = this.options.siteId;
  load('//' + id + '.hittail.com/mlt.js', callback);
};
});
require.register("analytics/lib/integrations/hubspot.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `HubSpot`.
 */

var HubSpot = module.exports = integration('HubSpot')
  .assumesPageview()
  .readyOnInitialize()
  .option('portalId', null);


/**
 * Exists?
 */

HubSpot.prototype.exists = function () {
  return !! window._hsq;
};


/**
 * Initialize.
 */

HubSpot.prototype.initialize = function () {
  window._hsq = [];
  this.load();
};


/**
 * Load the HubSpot library.
 *
 * @param {Function} callback
 */

HubSpot.prototype.load = function (callback) {
  if (document.getElementById('hs-analytics')) return;
  var id = this.options.portalId;
  var cache = Math.ceil(new Date() / 300000) * 300000;
  var url = 'https://js.hubspot.com/analytics/' + cache + '/' + id + '.js';
  var script = load(url, callback);
  script.id = 'hs-analytics';
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

HubSpot.prototype.identify = function (id, traits, options) {
  if (!traits.email) return;
  if (id) traits.id = id;
  push('identify', traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

HubSpot.prototype.track = function (event, properties, options) {
  push('trackEvent', event, properties);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

HubSpot.prototype.page = function (name, properties, options) {
  push('_trackPageview');
};


/**
 * Helper to push onto the HubSpot queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._hsq.push(args);
}
});
require.register("analytics/lib/integrations/improvely.js", function(exports, require, module){

var alias = require('alias');
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Improvely`.
 */

var Improvely = module.exports = integration('Improvely')
  .assumesPageview()
  .readyOnInitialize()
  .option('domain', '')
  .option('projectId', null);


/**
 * Exists?
 */

Heap.prototype.exists = function () {
  return !! window._improvely || window.improvely;
};


/**
 * Initialize.
 *
 * http://www.improvely.com/docs/landing-page-code
 */

Improvely.prototype.initialize = function () {
  window._improvely = [];
  window.improvely = {init: function (e, t) { window._improvely.push(["init", e, t]); }, goal: function (e) { window._improvely.push(["goal", e]); }, label: function (e) { window._improvely.push(["label", e]); } };

  var domain = this.options.domain;
  var id = this.options.projectId;
  window.improvely.init(domain, id);
  this.load();
};


/**
 * Load the Improvely library.
 *
 * @param {Function} callback
 */

Improvely.prototype.load = function (callback) {
  var domain = this.options.domain;
  load('//' + domain + '.iljmp.com/improvely.js', callback);
};


/**
 * Identify.
 *
 * http://www.improvely.com/docs/labeling-visitors
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Improvely.prototype.identify = function (id, traits, options) {
  if (id) window.improvely.label(id);
};


/**
 * Track.
 *
 * http://www.improvely.com/docs/conversion-code
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Improvely.prototype.track = function (event, properties, options) {
  properties.type = event;
  properties = alias(properties, { revenue: 'amount' });
  window.improvely.goal(properties);
};
});
require.register("analytics/lib/integrations/inspectlet.js", function(exports, require, module){

var integration = require('../integration');
var alias = require('alias');
var clone = require('clone');
var load = require('load-script-once');
var push = require('global-queue')('__insp');


/**
 * Expose `Inspectlet`.
 */

var Inspectlet = module.exports = integration('Inspectlet')
  .assumesPageview()
  .readyOnLoad()
  .option('wid', '');


/**
 * Exists?
 */

Inspectlet.prototype.exists = function () {
  return !! window.__insp;
};


/**
 * Initialize.
 *
 * https://www.inspectlet.com/dashboard/embedcode/1492461759/initial
 */

Inspectlet.prototype.initialize = function () {
  push('wid', this.options.wid);
  this.load();
};


/**
 * Load the Inspectlet library.
 *
 * @param {Function} callback
 */

Inspectlet.prototype.load = function (callback) {
  load('//www.inspectlet.com/inspectlet.js', callback);
};
});
require.register("analytics/lib/integrations/intercom.js", function(exports, require, module){

var alias = require('alias');
var convertDates = require('convert-dates');
var integration = require('../integration');
var each = require('each');
var is = require('is');
var isEmail = require('is-email');
var load = require('load-script-once');


/**
 * Expose `Intercom`.
 */

var Intercom = module.exports = integration('Intercom')
  .assumesPageview()
  .readyOnLoad()
  .option('activator', '#IntercomDefaultWidget')
  .option('appId', '')
  .option('counter', true)
  .option('inbox', false);


/**
 * Exists?
 */

Intercom.prototype.exists = function () {
  return !! window.Intercom;
};


/**
 * Initialize.
 *
 * http://docs.intercom.io/
 * http://docs.intercom.io/#IntercomJS
 */

Intercom.prototype.initialize = function () {
  this.load();
};


/**
 * Load the Intercom library.
 *
 * @param {Function} callback
 */

Intercom.prototype.load = function (callback) {
  load('https://static.intercomcdn.com/intercom.v1.js', callback);
};


/**
 * Identify.
 *
 * http://docs.intercom.io/#IntercomJS
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Intercom.prototype.identify = function (id, traits, options) {
  if (!id && !traits.email) return; // one is required

  traits.app_id = this.options.appId;
  if (id) traits.user_id = id;

  // handle dates
  traits = convertDates(traits, formatDate);
  traits = alias(traits, { created: 'created_at'});
  if (traits.company) alias(traits.company, { created: 'created_at' });

  // handle options
  options || (options = {});
  var Intercom = options.Intercom || options.intercom || {};
  if (Intercom.increments) traits.increments = Intercom.increments;
  if (Intercom.userHash) traits.user_hash = Intercom.userHash;
  if (Intercom.user_hash) traits.user_hash = Intercom.user_hash;
  if (this.options.inbox) {
    traits.widget = {
      activator: this.options.activator,
      use_counter: this.options.counter
    };
  }

  var method = this._id !== id ? 'boot': 'update';
  this._id = id; // cache for next time

  window.Intercom(method, traits);
};


/**
 * Group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Intercom.prototype.group = function (id, properties, options) {
  properties.id = id;
  window.Intercom('update', { company: properties });
};


/**
 * Format a date to Intercom's liking.
 *
 * @param {Date} date
 * @return {Number}
 */

function formatDate (date) {
  return Math.floor(date / 1000);
}
});
require.register("analytics/lib/integrations/keen-io.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Keen IO`.
 */

var Keen = module.exports = integration('Keen IO')
  .readyOnInitialize()
  .option('projectId', '')
  .option('readKey', '')
  .option('writeKey', '')
  .option('trackNamedPages', true)
  .option('trackAllPages', false);


/**
 * Exists?
 */

Keen.prototype.exists = function () {
  return !! window.Keen;
};


/**
 * Initialize.
 *
 * https://keen.io/docs/
 */

Keen.prototype.initialize = function () {
  var options = this.options;
  window.Keen = window.Keen||{configure:function(e){this._cf=e;},addEvent:function(e,t,n,i){this._eq=this._eq||[],this._eq.push([e,t,n,i]);},setGlobalProperties:function(e){this._gp=e;},onChartsReady:function(e){this._ocrq=this._ocrq||[],this._ocrq.push(e);}};
  window.Keen.configure({
    projectId: options.projectId,
    writeKey: options.writeKey,
    readKey: options.readKey
  });
  callback.async();
  this.load();
};


/**
 * Load the Keen IO library.
 *
 * @param {Function} callback
 */

Keen.prototype.load = function (callback) {
  load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js', callback);
};


/**
 * Identify.
 *
 * TODO: migrate from old `userId` to simpler `id`
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Keen.prototype.identify = function (id, traits, options) {
  var user = {};
  if (id) user.userId = id;
  if (traits) user.traits = traits;
  window.Keen.setGlobalProperties(function() {
    return { user: user };
  });
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Keen.prototype.track = function (event, properties, options) {
  window.Keen.addEvent(event, properties);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Keen.prototype.page = function (name, properties, options) {
  var settings = this.options;
  if (!settings.page) return;

  // named pages
  if (settings.trackNamedPages && name) this.track('Viewed ' + name + ' Page', properties);

  // all pages
  if (settings.trackAllPages) this.track('Loaded a Page', properties);
};
});
require.register("analytics/lib/integrations/kissmetrics.js", function(exports, require, module){

var alias = require('alias');
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');
var push = require('global-queue')('_kmq');


/**
 * Expose `KISSmetrics`.
 */

var KISSmetrics = module.exports = integration('KISSmetrics')
  .assumesPageview()
  .readyOnInitialize()
  .option('apiKey', '')
  .option('trackNamedPages', true);


/**
 * Exists?
 */

KISSmetrics.prototype.exists = function () {
  return !! window._kmq;
};


/**
 * Initialize.
 *
 * http://support.kissmetrics.com/apis/javascript
 */

KISSmetrics.prototype.initialize = function () {
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

KISSmetrics.prototype.load = function (callback) {
  var key = this.options.apiKey;
  load('//i.kissmetrics.com/i.js');
  load('//doug1izaerwt3.cloudfront.net/' + key + '.1.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

KISSmetrics.prototype.identify = function (id, traits, options) {
  if (id) push('identify', id);
  if (traits) push('set', traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

KISSmetrics.prototype.track = function (event, properties, options) {
  properties = alias(properties, { revenue: 'Billing Amount' });
  push('record', event, properties);
};


/**
 * Alias.
 *
 * @param {String} to
 * @param {String} from (optional)
 */

KISSmetrics.prototype.alias = function (to, from) {
  push('alias', to, from);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

KISSmetrics.prototype.page = function (name, properties, options) {
  if (!this.options.trackNamedPages || !name) return;
  this.track('Viewed ' + name + ' Page', properties);
};
});
require.register("analytics/lib/integrations/klaviyo.js", function(exports, require, module){

var alias = require('alias');
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');
var push = require('global-queue')('_learnq');


/**
 * Expose `Klaviyo`.
 */

var Klaviyo = module.exports = integration('Klaviyo')
  .assumesPageview()
  .readyOnInitialize()
  .option('apiKey', '');


/**
 * Exists?
 */

Klaviyo.prototype.exists = function () {
  return !! window._learnq;
};


/**
 * Initialize.
 *
 * https://www.klaviyo.com/docs/getting-started
 */

Klaviyo.prototype.initialize = function () {
  push('account', this.options.apiKey);
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Klaviyo.prototype.load = function (callback) {
  load('//a.klaviyo.com/media/js/learnmarklet.js', callback);
};


/**
 * Trait aliases.
 */

var aliases = {
  id: '$id',
  email: '$email',
  firstName: '$first_name',
  lastName: '$last_name',
  phone: '$phone_number',
  title: '$title'
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Klaviyo.prototype.identify = function (id, traits, options) {
  if (!id && !traits.email) return;
  if (id) traits.id = id;
  traits = alias(traits, aliases);
  push('identify', traits);
};


/**
 * Group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 */

Klaviyo.prototype.group = function (id, properties) {
  if (!properties.name) return;
  push('identify', { $organization: properties.name });
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Klaviyo.prototype.track = function (event, properties, options) {
  push('track', event, properties);
};


/**
 * Helper to push onto the Klaviyo queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._learnq.push(args);
}
});
require.register("analytics/lib/integrations/leadlander.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `LeadLander`.
 */

var LeadLander = module.exports = integration('LeadLander')
  .assumesPageview()
  .readyOnLoad()
  .option('accountId', null);


/**
 * Exists?
 */

LeadLander.prototype.exists = function () {
  return !! window.llactid;
};


/**
 * Initialize.
 */

LeadLander.prototype.initialize = function () {
  window.llactid = this.options.accountId;
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

LeadLander.prototype.load = function (callback) {
  load('http://t6.trackalyzer.com/trackalyze-nodoc.js', callback);
};
});
require.register("analytics/lib/integrations/livechat.js", function(exports, require, module){

var each = require('each');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `LiveChat`.
 */

var LiveChat = module.exports = integration('LiveChat')
  .assumesPageview()
  .readyOnLoad()
  .option('license', '');


/**
 * Exists?
 */

LiveChat.prototype.exists = function () {
  return !! window.__lc;
};


/**
 * Initialize.
 *
 * http://www.livechatinc.com/api/javascript-api
 */

LiveChat.prototype.initialize = function () {
  window.__lc = { license: this.options.license };
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

LiveChat.prototype.load = function (callback) {
  load('//cdn.livechatinc.com/tracking.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

LiveChat.prototype.identify = function (id, traits, options) {
  if (id) traits['User ID'] = id;
  window.LC_API.set_custom_variables(convert(traits));
};


/**
 * Convert a traits object into the format LiveChat requires.
 *
 * @param {Object} traits
 * @return {Array}
 */

function convert (traits) {
  var arr = [];
  each(traits, function (key, value) {
    arr.push({ name: key, value: value });
  });
  return arr;
}
});
require.register("analytics/lib/integrations/lytics.js", function(exports, require, module){

var alias = require('alias');
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose a `Lytics`.
 */

var Lytics = module.exports = integration('Lytics')
  .assumesPageview()
  .readyOnInitialize()
  .option('cid', '')
  .option('cookie', 'seerid')
  .option('delay', 200)
  .option('initialPageview', true)
  .option('sessionTimeout', 1800)
  .option('url', '//c.lytics.io');


/**
 * Exists?
 */

Lytics.prototype.exists = function () {
  return !! window.jstag;
};


/**
 * Options aliases.
 */

var aliases = {
  sessionTimeout: 'sessecs'
};


/**
 * Initialize.
 *
 * http://admin.lytics.io/doc#jstag
 */

Lytics.prototype.initialize = function () {
  var options = alias(this.options, aliases);
  window.jstag = (function () {var t = {_q: [], _c: options, ts: (new Date()).getTime() }; t.send = function() {this._q.push([ 'ready', 'send', Array.prototype.slice.call(arguments) ]); return this; }; return t; })();
  this.load();
};


/**
 * Load the Lytics library.
 *
 * @param {Function} callback
 */

Lytics.prototype.load = function (callback) {
  load('//c.lytics.io/static/io.min.js', callback);
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

Lytics.prototype.track = function (event, properties, options) {
  properties._e = event;
  window.jstag.send(properties);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Lytics.prototype.page = function (name, properties, optional) {
  window.jstag.send(properties);
};
});
require.register("analytics/lib/integrations/mixpanel.js", function(exports, require, module){

var alias = require('alias');
var clone = require('clone');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Mixpanel`.
 */

var Mixpanel = module.exports = integration('Mixpanel')
  .assumesPageview()
  .readyOnLoad()
  .option('cookieName', '')
  .option('nameTag', true)
  .option('pageview', false)
  .option('people', false)
  .option('token', '')
  .option('trackAllPages', false)
  .option('trackNamedPages', true);


/**
 * Exists?
 */

Mixpanel.prototype.exists = function () {
  return !! window.mixpanel;
};


/**
 * Options aliases.
 */

var optionsAliases = {
  cookieName: 'cookie_name'
};


/**
 * Initialize.
 *
 * https://mixpanel.com/help/reference/javascript#installing
 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.init
 */

Mixpanel.prototype.initialize = function () {
  (function (c, a) {window.mixpanel = a; var b, d, h, e; a._i = []; a.init = function (b, c, f) {function d(a, b) {var c = b.split('.'); 2 == c.length && (a = a[c[0]], b = c[1]); a[b] = function () {a.push([b].concat(Array.prototype.slice.call(arguments, 0))); }; } var g = a; 'undefined' !== typeof f ? g = a[f] = [] : f = 'mixpanel'; g.people = g.people || []; h = ['disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'alias', 'name_tag', 'set_config', 'people.set', 'people.increment', 'people.track_charge', 'people.append']; for (e = 0; e < h.length; e++) d(g, h[e]); a._i.push([b, c, f]); }; a.__SV = 1.2; })(document, window.mixpanel || []);
  var options = alias(this.options, optionsAliases);
  window.mixpanel.init(options.token, options);
  this.load(this.ready);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Mixpanel.prototype.load = function (callback) {
  load('//cdn.mxpnl.com/libs/mixpanel-2.2.min.js', callback);
};


/**
 * Trait aliases.
 */

var traitAliases = {
  created: '$created',
  email: '$email',
  firstName: '$first_name',
  lastName: '$last_name',
  lastSeen: '$last_seen',
  name: '$name',
  username: '$username',
  phone: '$phone'
};


/**
 * Identify.
 *
 * https://mixpanel.com/help/reference/javascript#super-properties
 * https://mixpanel.com/help/reference/javascript#user-identity
 * https://mixpanel.com/help/reference/javascript#storing-user-profiles
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Mixpanel.prototype.identify = function (id, traits, options) {
  // id
  if (id) window.mixpanel.identify(id);

  // name tag
  var nametag = traits.email || traits.username || id;
  if (nametag) window.mixpanel.name_tag(nametag);

  // traits
  traits = alias(traits, traitAliases);
  window.mixpanel.register(traits);
  if (this.options.people) window.mixpanel.people.set(traits);
};


/**
 * Track.
 *
 * https://mixpanel.com/help/reference/javascript#sending-events
 * https://mixpanel.com/help/reference/javascript#tracking-revenue
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Mixpanel.prototype.track = function (event, properties, options) {
  window.mixpanel.track(event, properties);
  if (properties.revenue && this.options.people) {
    window.mixpanel.people.track_charge(properties.revenue);
  }
};


/**
 * Page.
 *
 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.track_pageview
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Mixpanel.prototype.page = function (name, properties, options) {
  var all = this.options.trackAllPages;
  var named = this.options.trackNamedPages;
  if (named && name) this.track('Viewed ' + name + ' Page', properties);
  if (all) this.track('Loaded a Page', properties);
};


/**
 * Alias.
 *
 * https://mixpanel.com/help/reference/javascript#user-identity
 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.alias
 *
 * @param {String} to
 * @param {String} from (optional)
 */

Mixpanel.prototype.alias = function (to, from) {
  var mp = window.mixpanel;
  if (mp.get_distinct_id && mp.get_distinct_id() === to) return;
  // HACK: internal mixpanel API to ensure we don't overwrite
  if (mp.get_property && mp.get_property('$people_distinct_id') === to) return;
  // although undocumented, mixpanel takes an optional original id
  mp.alias(to, from);
};
});
require.register("analytics/lib/integrations/mousestats.js", function(exports, require, module){

var each = require('each');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `MouseStats`.
 */

var MouseStats = module.exports = integration('MouseStats')
  .assumesPageview()
  .readyOnLoad()
  .option('accountNumber', '');


/**
 * Exists?
 */

MouseStats.prototype.exists = function () {
  return !! window.msaa;
};


/**
 * Initialize.
 *
 * http://www.mousestats.com/docs/pages/allpages
 */

MouseStats.prototype.initialize = function () {
  this.load(this.ready);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

MouseStats.prototype.load = function (callback) {
  var number = this.options.accountNumber;
  var path = number.slice(0,1) + '/' + number.slice(1,2) + '/' + number;
  var cache = Math.floor(new Date().getTime() / 60000);
  var partial = '.mousestats.com/js/' + path + '.js?' + cache;
  var http = 'http://www2' + partial;
  var https = 'https://ssl' + partial;
  load({ http: http, https: https }, callback);
};


/**
 * Identify.
 *
 * http://www.mousestats.com/docs/wiki/7/how-to-add-custom-data-to-visitor-playbacks
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

MouseStats.prototype.identify = function (id, traits, options) {
  if (id) traits.id = id;
  each(traits, function (key, value) {
    window.MouseStatsVisitorPlaybacks.customVariable(key, value);
  });
};
});
require.register("analytics/lib/integrations/olark.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var https = require('use-https');


/**
 * Expose `Olark`.
 */

var Olark = module.exports = integration('Olark')
  .assumesPageview()
  .readyOnInitialize()
  .option('identify', true)
  .option('page', true)
  .option('siteId', '')
  .option('track', false);


/**
 * Exists?
 */

Olark.prototype.exists = function () {
  return !! window.olark;
};


/**
 * Initialize.
 *
 * http://www.olark.com/documentation
 */

Olark.prototype.initialize = function () {
  window.olark||(function(c){var f=window,d=document,l=https()?"https:":"http:",z=c.name,r="load";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
  window.olark.identify(this.options.siteId);

  // keep track of the widget's open state
  var self = this;
  box('onExpand', function () { self._open = true; });
  box('onShrink', function () { self._open = false; });
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Olark.prototype.identify = function (id, traits, options) {
  if (!this.options.identify) return;
  if (id) traits.id = id;

  visitor('updateCustomFields', traits);
  if (traits.email) visitor('updateEmailAddress', { emailAddress: traits.email });
  if (traits.phone) visitor('updatePhoneNumber', { phoneNumber: traits.phone });

  // figure out best name
  var name = traits.firstName;
  if (traits.lastName) name += ' ' + traits.lastName;
  if (traits.name) name = traits.name;
  if (name) visitor('updateFullName', { fullName: name });

  // figure out best nickname
  var nickname = name || traits.email || traits.username || id;
  if (name && traits.email) nickname += ' (' + traits.email + ')';
  if (nickname) chat('updateVisitorNickname', { snippet: nickname });
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Olark.prototype.track = function (event, properties, options) {
  if (!this.options.track || !this._open) return;
  chat('sendNotificationToOperator', {
    body: 'visitor triggered "' + event + '"' // lowercase since olark does
  });
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Olark.prototype.page = function (name, properties, options) {
  if (!this.options.page || !this._open) return;
  chat('sendNotificationToOperator', {
    body: 'looking at ' + properties.url // lowercase since olark does
  });
};


/**
 * Helper method for Olark box API calls.
 *
 * @param {String} action
 * @param {Object} value
 */

function box (action, value) {
  window.olark('api.box.' + action, value);
}


/**
 * Helper method for Olark visitor API calls.
 *
 * @param {String} action
 * @param {Object} value
 */

function visitor (action, value) {
  window.olark('api.visitor.' + action, value);
}


/**
 * Helper method for Olark chat API calls.
 *
 * @param {String} action
 * @param {Object} value
 */

function chat (action, value) {
  window.olark('api.chat.' + action, value);
}
});
require.register("analytics/lib/integrations/optimizely.js", function(exports, require, module){

var bind = require('bind');
var callback = require('callback');
var each = require('each');
var integration = require('../integration');
var load = require('load-script-once');
var push = require('global-queue')('optimizely');
var tick = require('next-tick');


/**
 * Expose `Optimizely`.
 */

var Optimizely = module.exports = integration('Optimizely')
  .readyOnInitialize()
  .option('variations', true);


/**
 * Exists?
 */

Optimizely.prototype.exists = function () {
  return false; // we require it to exist, no async support yet
};


/**
 * Initialize.
 *
 * https://www.optimizely.com/docs/api#function-calls
 */

Optimizely.prototype.initialize = function () {
  if (this.options.variations) tick(this.replay);
};


/**
 * Track.
 *
 * https://www.optimizely.com/docs/api#track-event
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Optimizely.prototype.track = function (event, properties, options) {
  if (properties.revenue) properties.revenue = properties.revenue * 100;
  push('trackEvent', event, properties);
};


/**
 * Replay experiment data as traits to other enabled providers.
 *
 * https://www.optimizely.com/docs/api#data-object
 */

Optimizely.prototype.replay = function () {
  var data = window.optimizely.data;
  if (!data) return;

  var experiments = data.experiments;
  var map = data.state.variationNamesMap;
  var traits = {};

  each(map, function (experimentId, variation) {
    var experiment = experiments[experimentId].name;
    traits['Experiment: ' + experiment] = variation;
  });

  this.analytics.identify(traits);
};
});
require.register("analytics/lib/integrations/perfect-audience.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `PerfectAudience`.
 */

var PerfectAudience = module.exports = integration('Perfect Audience')
  .assumesPageview()
  .readyOnLoad()
  .option('siteId', '');


/**
 * Exists?
 */

PerfectAudience.prototype.exists = function () {
  return !! window._pa;
};


/**
 * Initialize.
 *
 * https://www.perfectaudience.com/docs#javascript_api_autoopen
 */

PerfectAudience.prototype.initialize = function () {
  window._pa = {};
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

PerfectAudience.prototype.load = function (callback) {
  var id = this.options.siteId;
  load('//tag.perfectaudience.com/serve/' + id + '.js', callback);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

PerfectAudience.prototype.track = function (event, properties, options) {
  window._pa.track(event, properties);
};
});
require.register("analytics/lib/integrations/pingdom.js", function(exports, require, module){

var date = require('load-date');
var integration = require('../integration');
var load = require('load-script-once');
var push = require('global-queue')('_prum');


/**
 * Expose `Pingdom`.
 */

var Pingdom = module.exports = integration('Pingdom')
  .assumesPageview()
  .readyOnLoad()
  .option('id', '');


/**
 * Exists?
 */

Pingdom.prototype.exists = function () {
  return !! window._prum;
};


/**
 * Initialize.
 */

Pingdom.prototype.initialize = function () {
  push('id', this.options.id);
  push('mark', 'firstbyte', date.getTime());
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Pingdom.prototype.load = function (callback) {
  load('//rum-static.pingdom.net/prum.min.js', callback);
};
});
require.register("analytics/lib/integrations/preact.js", function(exports, require, module){

var alias = require('alias');
var callback = require('callback');
var convertDates = require('convert-dates');
var integration = require('../integration');
var load = require('load-script-once');
var push = require('global-queue')('_lnq');


/**
 * Expose `Preact`.
 */

var Preact = module.exports = integration('Preact')
  .assumesPageview()
  .readyOnInitialize()
  .option('projectCode', '');


/**
 * Exists?
 */

Preact.prototype.exists = function () {
  return !! window._lnq;
};


/**
 * Initialize.
 *
 * http://www.preact.io/api/javascript
 */

Preact.prototype.initialize = function () {
  push("_setCode", this.options.projectCode);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Preact.prototype.load = function (callback) {
  load('//d2bbvl6dq48fa6.cloudfront.net/js/ln-2.4.min.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Preact.prototype.identify = function (id, traits, options) {
  if (!id) return;
  traits = convertDates(traits, convertDate);
  traits = alias(traits, { created: 'created_at' });
  push('_setPersonData', {
    name: traits.name,
    email: traits.email,
    uid: id,
    properties: traits
  });
};


/**
 * Group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Preact.prototype.group = function (id, properties, options) {
  if (!id) return;
  properties.id = id;
  push('_setAccount', properties);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Preact.prototype.track = function (event, properties, options) {
  var special = {};
  special.name = event;
  if (properties.revenue) {
    special.revenue = properties.revenue * 100;
    delete properties.revenue;
  }
  if (properties.note) {
    special.note = properties.note;
    delete properties.note;
  }
  push('_logEvent', special, properties);
};


/**
 * Convert a `date` to a format Preact supports.
 *
 * @param {Date} date
 * @return {Number}
 */

function convertDate (date) {
  return Math.floor(date / 1000);
}


/**
 * Helper to push onto the Preact queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._lnq.push(args);
}
});
require.register("analytics/lib/integrations/qualaroo.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');
var push = require('global-queue')('_kiq');


/**
 * Expose `Qualaroo`.
 */

var Qualaroo = module.exports = integration('Qualaroo')
  .assumesPageview()
  .readyOnInitialize()
  .option('customerId', '')
  .option('siteToken', '')
  .option('track', true);


/**
 * Exists?
 */

Qualaroo.prototype.exists = function () {
  return !! window._kiq;
};


/**
 * Initialize.
 */

Qualaroo.prototype.initialize = function () {
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Qualaroo.prototype.load = function (callback) {
  var token = this.options.siteToken;
  var id = this.options.customerId;
  load('//s3.amazonaws.com/ki.js/' + id + '/' + token + '.js', callback);
};


/**
 * Identify.
 *
 * http://help.qualaroo.com/customer/portal/articles/731085-identify-survey-nudge-takers
 * http://help.qualaroo.com/customer/portal/articles/731091-set-additional-user-properties
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Qualaroo.prototype.identify = function (id, traits, options) {
  if (traits.email) id = traits.email;
  if (id) push('identify', id);
  if (traits) push('set', traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Qualaroo.prototype.track = function (event, properties, options) {
  if (!this.options.track) return;
  var traits = {};
  traits['Triggered: ' + event] = true;
  this.identify(null, traits);
};


/**
 * Helper to push onto the Qualaroo queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._kiq.push(args);
}
});
require.register("analytics/lib/integrations/quantcast.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Quantcast`.
 */

var Quantcast = module.exports = integration('Quantcast')
  .assumesPageview()
  .readyOnInitialize()
  .option('pCode', null);


/**
 * Exists?
 */

Quantcast.prototype.exists = function () {
  return !! window._qevents;
};


/**
 * Initialize.
 *
 * https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/
 */

Quantcast.prototype.initialize = function () {
  window._qevents = [{ qacct: this.options.pCode }];
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Quantcast.prototype.load = function (callback) {
  load({
    http: 'http://edge.quantserve.com/quant.js',
    https: 'https://secure.quantserve.com/quant.js'
  }, callback);
};
});
require.register("analytics/lib/integrations/rollbar.js", function(exports, require, module){

var callback = require('callback');
var clone = require('clone');
var extend = require('extend');
var integration = require('../integration');
var load = require('load-script-once');
var onError = require('on-error');


/**
 * Expose `Rollbar`.
 */

var Rollbar = module.exports = integration('Rollbar')
  .readyOnInitialize()
  .option('accessToken', '')
  .option('identify', true);


/**
 * Exists?
 */

Rollbar.prototype.exists = function () {
  return !! window._rollbar;
};


/**
 * Initialize.
 *
 * https://rollbar.com/docs/notifier/rollbar.js/
 */

Rollbar.prototype.initialize = function () {
  var options = this.options;
  window._rollbar = window._rollbar || window._ratchet || [options.accessToken, options];
  onError(function() { window._rollbar.push(arguments); });
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Rollbar.prototype.load = function (callback) {
  load('//d37gvrvc0wt4s1.cloudfront.net/js/1/rollbar.min.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Rollbar.prototype.identify = function (id, traits, options) {
  if (!this.options.identify) return;
  if (id) traits.id = id;

  // rollbar keeps extra params as the second item in their array until loaded
  var rollbar = window._rollbar;
  var params = rollbar.shift
    ? rollbar[1] = rollbar[1] || {}
    : rollbar.extraParams = rollbar.extraParams || {};
  params.person = params.person || {};
  extend(params.person, traits);
};

});
require.register("analytics/lib/integrations/sentry.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Sentry`.
 */

var Sentry = module.exports = integration('Sentry')
  .readyOnLoad()
  .option('config', '');


/**
 * Exists?
 */

Sentry.prototype.exists = function () {
  return !! window.Raven;
};


/**
 * Initialize.
 *
 * http://raven-js.readthedocs.org/en/latest/config/index.html
 */

Sentry.prototype.initialize = function () {
  var config = this.options.config;
  this.load(function () {
    // for now, raven basically requires `install` to be called
    // https://github.com/getsentry/raven-js/blob/master/src/raven.js#L113
    window.Raven.config(config).install();
  });
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Sentry.prototype.load = function (callback) {
  load('//d3nslu0hdya83q.cloudfront.net/dist/1.0/raven.min.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Sentry.prototype.identify = function (id, traits, options) {
  if (id) traits.id = id;
  window.Raven.setUser(traits);
};
});
require.register("analytics/lib/integrations/snapengage.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `SnapEngage`.
 */

var SnapEngage = module.exports = integration('SnapEngage')
  .assumesPageview()
  .readyOnLoad()
  .option('apiKey', '');


/**
 * Exists?
 */

SnapEngage.prototype.exists = function () {
  return !! window.SnapABug;
};


/**
 * Initialize.
 *
 * http://help.snapengage.com/installation-guide-getting-started-in-a-snap/
 */

SnapEngage.prototype.initialize = function () {
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

SnapEngage.prototype.load = function (callback) {
  var key = this.options.apiKey;
  var url = '//commondatastorage.googleapis.com/code.snapengage.com/js/' + key + '.js';
  load(url, callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

SnapEngage.prototype.identify = function (id, traits, options) {
  if (!traits.email) return;
  window.SnapABug.setUserEmail(traits.email);
};
});
require.register("analytics/lib/integrations/spinnakr.js", function(exports, require, module){

var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Spinnakr`.
 */

var Spinnakr = module.exports = integration('Spinnakr')
  .assumesPageview()
  .readyOnLoad()
  .option('siteId', '');


/**
 * Exists?
 */

Spinnakr.prototype.exists = function () {
  return !! window._spinnakr_site_id;
};


/**
 * Initialize.
 */

Spinnakr.prototype.initialize = function () {
  window._spinnakr_site_id = this.options.siteId;
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Spinnakr.prototype.load = function (callback) {
  load('//d3ojzyhbolvoi5.cloudfront.net/js/so.js', callback);
};
});
require.register("analytics/lib/integrations/tapstream.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');
var slug = require('slug');
var push = require('global-queue')('_tsq');


/**
 * Expose `Tapstream`.
 */

var Tapstream = module.exports = integration('Tapstream')
  .assumesPageview()
  .readyOnInitialize()
  .option('accountName', '')
  .option('trackAllPages', true)
  .option('trackNamedPages', true);


/**
 * Exists?
 */

Tapstream.prototype.exists = function () {
  return !! window._tsq;
};


/**
 * Initialize.
 */

Tapstream.prototype.initialize = function () {
  push('setAccountName', this.options.accountName);
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Tapstream.prototype.load = function (callback) {
  load('//cdn.tapstream.com/static/js/tapstream.js', callback);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Tapstream.prototype.track = function (event, properties, options) {
  push('fireHit', slug(event), [properties.url]); // needs events as slugs
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Tapstream.prototype.page = function (name, properties, options) {
  var named = this.options.trackNamePages;
  var all = this.options.trackAllPages;
  if (named && name) this.track('Viewed ' + name + ' Page', properties);
  if (all) this.track('Loaded a Page', properties);
};
});
require.register("analytics/lib/integrations/trakio.js", function(exports, require, module){

var alias = require('alias');
var callback = require('callback');
var clone = require('clone');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose a `trak.io`.
 */

var Trakio = module.exports = integration('trak.io')
  .assumesPageview()
  .readyOnInitialize()
  .option('token', '')
  .option('trackNamedPages', true);


/**
 * Exists?
 */

Trakio.prototype.exists = function () {
  return !! window.trak;
};


/**
 * Options aliases.
 */

var optionsAliases = {
  initialPageview: 'auto_track_page_view'
};


/**
 * Initialize.
 *
 * https://docs.trak.io
 */

Trakio.prototype.initialize = function () {
  var self = this;
  var options = this.options;
  window.trak = window.trak || [];
  window.trak.io = window.trak.io || {};
  window.trak.io.load = function(e) {self.load(); var r = function(e) {return function() {window.trak.push([e].concat(Array.prototype.slice.call(arguments,0))); }; } ,i=["initialize","identify","track","alias","channel","source","host","protocol","page_view"]; for (var s=0;s<i.length;s++) window.trak.io[i[s]]=r(i[s]); window.trak.io.initialize.apply(window.trak.io,arguments); };
  window.trak.io.load(options.token, alias(options, optionsAliases));
  this.load();
};


/**
 * Load the trak.io library.
 *
 * @param {Function} callback
 */

Trakio.prototype.load = function (callback) {
  load('//d29p64779x43zo.cloudfront.net/v1/trak.io.min.js', callback);
};


/**
 * Trait aliases.
 *
 * http://docs.trak.io/properties.html#special
 */

var traitAliases = {
  avatar: 'avatar_url',
  firstName: 'first_name',
  lastName: 'last_name'
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Trakio.prototype.identify = function (id, traits, options) {
  alias(traits, traitAliases);
  if (id) {
    window.trak.io.identify(id, traits);
  } else {
    window.trak.io.identify(traits);
  }
};


/**
 * Group.
 *
 * @param {String} id (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 *
 * TODO: add group
 * TODO: add `trait.company/organization` from trak.io docs http://docs.trak.io/properties.html#special
 */


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
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Trakio.prototype.page = function (name, properties, options) {
  window.trak.io.page_view(properties.url, properties.title);

  // named pages
  if (this.options.trackNamedPages && name) {
    this.track('Viewed ' + name + ' Page', properties);
  }
};


/**
 * Alias.
 *
 * @param {String} to
 * @param {String} from (optional)
 */

Trakio.prototype.alias = function (to, from) {
  if (to === window.trak.io.distinct_id()) return;
  if (from) {
    window.trak.io.alias(from, to);
  } else {
    window.trak.io.alias(to);
  }
};
});
require.register("analytics/lib/integrations/usercycle.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');
var push = require('global-queue')('_uc');


/**
 * Expose `Usercycle`.
 */

var Usercycle = module.exports = integration('USERcycle')
  .assumesPageview()
  .readyOnInitialize()
  .option('key', '');


/**
 * Exists?
 */

Usercycle.prototype.exists = function () {
  return !! window._uc;
};


/**
 * Initialize.
 *
 * http://docs.usercycle.com/javascript_api
 */

Usercycle.prototype.initialize = function () {
  push('_key', this.options.key);
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Usercycle.prototype.load = function (callback) {
  load('//api.usercycle.com/javascripts/track.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Usercycle.prototype.identify = function (id, traits, options) {
  if (id) push('uid', id);
  // there's a special `came_back` event used for retention and traits
  push('action', 'came_back', traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Usercycle.prototype.track = function (event, properties, options) {
  push('action', event, properties);
};
});
require.register("analytics/lib/integrations/userfox.js", function(exports, require, module){

var alias = require('alias');
var callback = require('callback');
var convertDates = require('convert-dates');
var integration = require('../integration');
var load = require('load-script-once');
var push = require('global-queue')('_ufq');


/**
 * Expose `Userfox`.
 */

var Userfox = module.exports = integration('userfox')
  .assumesPageview()
  .readyOnInitialize()
  .option('clientId', '');


/**
 * Exists?
 */

Userfox.prototype.exists = function () {
  return !! window._ufq;
};


/**
 * Initialize.
 *
 * https://www.userfox.com/docs/
 */

Userfox.prototype.initialize = function (options, ready) {
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Userfox.prototype.load = function (callback) {
  load('//d2y71mjhnajxcg.cloudfront.net/js/userfox-stable.js', callback);
};


/**
 * Identify.
 *
 * https://www.userfox.com/docs/#custom-data
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Userfox.prototype.identify = function (id, traits, options) {
  if (!traits.email) return;

  // initialize the library with the email now that we have it
  push('init', {
    clientId: this.options.clientId,
    email: traits.email
  });

  convertDates(traits, formatDate);
  alias(traits, { created: 'signup_date' });
  push('track', traits);
};


/**
 * Convert a `date` to a format userfox supports.
 *
 * @param {Date} date
 * @return {String}
 */

function formatDate (date) {
  return Math.round(date.getTime() / 1000).toString();
}
});
require.register("analytics/lib/integrations/uservoice.js", function(exports, require, module){

var alias = require('alias');
var callback = require('callback');
var clone = require('clone');
var convertDates = require('convert-dates');
var integration = require('../integration');
var load = require('load-script-once');
var push = require('global-queue')('UserVoice');
var unix = require('to-unix-timestamp');


/**
 * Expose `UserVoice`.
 */

var UserVoice = module.exports = integration('UserVoice')
  .assumesPageview()
  .readyOnInitialize()
  .option('apiKey', '')
  .option('classic', false)
  .option('forumId', null)
  .option('showWidget', true)
  .option('mode', 'contact')
  .option('accentColor', '#448dd6')
  .option('trigger', null)
  .option('triggerPosition', 'bottom-right')
  .option('triggerColor', '#ffffff')
  .option('triggerBackgroundColor', 'rgba(46, 49, 51, 0.6)')
  // BACKWARDS COMPATIBILITY: classic options
  .option('classicMode', 'full')
  .option('primaryColor', '#cc6d00')
  .option('linkColor', '#007dbf')
  .option('defaultMode', 'support')
  .option('tabLabel', 'Feedback & Support')
  .option('tabColor', '#cc6d00')
  .option('tabPosition', 'middle-right')
  .option('tabInverted', false);


/**
 * Exists?
 */

UserVoice.prototype.exists = function () {
  return !! window.UserVoice;
};


/**
 * Initialize.
 */

UserVoice.prototype.initialize = function () {
  var options = this.options;

  if (options.classic) {
    this.identify = this.identifyClassic;
    delete this.group;
    return this.initializeClassic();
  }

  var opts = formatOptions(options);
  push('set', opts);
  push('autoprompt', {});
  if (options.showWidget) {
    options.trigger
      ? push('addTrigger', options.trigger, opts)
      : push('addTrigger', opts);
  }

  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

UserVoice.prototype.load = function (callback) {
  var key = this.options.apiKey;
  load('//widget.uservoice.com/' + key + '.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

UserVoice.prototype.identify = function (id, traits, options) {
  if (id) traits.id = id;
  convertDates(traits, unix);
  alias(traits, { created: 'created_at' });
  push('identify', traits);
};


/**
 * Group.
 *
 * @param {String} id (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

UserVoice.prototype.group = function (id, properties, options) {
  if (id) properties.id = id;
  convertDates(properties, unix);
  alias(properties, { created: 'created_at' });
  push('identify', { account: properties });
};


/**
 * Initialize (classic).
 *
 * @param {Object} options
 * @param {Function} ready
 */

UserVoice.prototype.initializeClassic = function () {
  var options = this.options;
  window.showClassicWidget = showClassicWidget; // part of public api
  if (options.showWidget) showClassicWidget('showTab', formatClassicOptions(options));
  this.load();
};


/**
 * Identify (classic).
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

UserVoice.prototype.identifyClassic = function (id, traits, options) {
  if (id) traits.id = id;
  push('setCustomFields', traits);
};


/**
 * Format the options for UserVoice.
 *
 * @param {Object} options
 * @return {Object}
 */

function formatOptions (options) {
  var cloned = clone(options);
  alias(cloned, {
    forumId: 'forum_id',
    accentColor: 'accent_color',
    triggerColor: 'trigger_color',
    triggerBackgroundColor: 'trigger_background_color',
    triggerPosition: 'trigger_position'
  });
  return cloned;
}


/**
 * Format the classic options for UserVoice.
 *
 * @param {Object} options
 * @return {Object}
 */

function formatClassicOptions (options) {
  var cloned = clone(options);
  alias(cloned, {
    forumId: 'forum_id',
    classicMode: 'mode',
    primaryColor: 'primary_color',
    tabPosition: 'tab_position',
    tabColor: 'tab_color',
    linkColor: 'link_color',
    defaultMode: 'default_mode',
    tabLabel: 'tab_label',
    tabInverted: 'tab_inverted'
  });
  return cloned;
}


/**
 * Show the classic version of the UserVoice widget. This method is usually part
 * of UserVoice classic's public API.
 *
 * @param {String} type ('showTab' or 'showLightbox')
 * @param {Object} options (optional)
 */

function showClassicWidget (type, options) {
  type || (type = 'showLightbox');
  push(type, 'classic_widget', options);
}
});
require.register("analytics/lib/integrations/vero.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');
var push = require('global-queue')('_veroq');


/**
 * Expose `Vero`.
 */

var Vero = module.exports = integration('Vero')
  .assumesPageview()
  .readyOnInitialize()
  .option('apiKey', '');


/**
 * Exists?
 */

Vero.prototype.exists = function () {
  return !! window._veroq;
};


/**
 * Initialize.
 *
 * https://github.com/getvero/vero-api/blob/master/sections/js.md
 */

Vero.prototype.initialize = function () {
  push('init', { api_key: this.options.apiKey });
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Vero.prototype.load = function (callback) {
  load('//d3qxef4rp70elm.cloudfront.net/m.js', callback);
};


/**
 * Identify.
 *
 * https://github.com/getvero/vero-api/blob/master/sections/js.md#user-identification
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Vero.prototype.identify = function (id, traits, options) {
  if (!id || !traits.email) return; // both required
  if (id) traits.id = id;
  push('user', traits);
};


/**
 * Track.
 *
 * https://github.com/getvero/vero-api/blob/master/sections/js.md#tracking-events
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Vero.prototype.track = function (event, properties, options) {
  push('track', event, properties);
};
});
require.register("analytics/lib/integrations/visual-website-optimizer.js", function(exports, require, module){

var callback = require('callback');
var each = require('each');
var inherit = require('inherit');
var integration = require('../integration');
var tick = require('next-tick');


/**
 * Expose `VWO`.
 */

var VWO = module.exports = integration('Visual Website Optimizer')
  .readyOnInitialize()
  .option('replay', true);


/**
 * Exists?
 */

VWO.prototype.exists = function () {
  return false; // we require it to be on the page already
};


/**
 * Initialize.
 *
 * http://v2.visualwebsiteoptimizer.com/tools/get_tracking_code.php
 */

VWO.prototype.initialize = function () {
  if (this.options.replay) this.replay();
};


/**
 * Replay the experiments the user has seen as traits to all other integrations.
 * Wait for the next tick to replay so that the `analytics` object and all of
 * the integrations are fully initialized.
 */

VWO.prototype.replay = function () {
  var analytics = this.analytics;
  tick(function () {
    experiments(function (err, traits) {
      if (traits) analytics.identify(traits);
    });
  });
};


/**
 * Get dictionary of experiment keys and variations.
 *
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param {Function} callback
 * @return {Object}
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
 * Add a `fn` to the VWO queue, creating one if it doesn't exist.
 *
 * @param {Function} fn
 */

function enqueue (fn) {
  window._vis_opt_queue = window._vis_opt_queue || [];
  window._vis_opt_queue.push(fn);
}


/**
 * Get the chosen variation's name from an experiment `id`.
 *
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param {String} id
 * @return {String}
 */

function variation (id) {
  var experiments = window._vwo_exp;
  if (!experiments) return null;
  var experiment = experiments[id];
  var variationId = experiment.combination_chosen;
  return variationId ? experiment.comb_n[variationId] : null;
}
});
require.register("analytics/lib/integrations/woopra.js", function(exports, require, module){

var each = require('each');
var extend = require('extend');
var integration = require('../integration');
var isEmail = require('is-email');
var load = require('load-script-once');
var type = require('type');
var user = require('../user');


/**
 * Expose `Woopra`.
 */

var Woopra = module.exports = integration('Woopra')
  .assumesPageview()
  .readyOnLoad()
  .option('domain', '');


/**
 * Exists?
 */

Woopra.prototype.exists = function () {
  return !! window.woopra;
};


/**
 * Initialize.
 *
 * http://www.woopra.com/docs/setup/javascript-tracking/
 */

Woopra.prototype.initialize = function () {
  (function () {var i, s, z, w = window, d = document, a = arguments, q = 'script', f = ['config', 'track', 'identify', 'visit', 'push', 'call'], c = function () {var i, self = this; self._e = []; for (i = 0; i < f.length; i++) {(function (f) {self[f] = function () {self._e.push([f].concat(Array.prototype.slice.call(arguments, 0))); return self; }; })(f[i]); } }; w._w = w._w || {}; for (i = 0; i < a.length; i++) { w._w[a[i]] = w[a[i]] = w[a[i]] || new c(); } })('woopra');
  window.woopra.config({ domain: this.options.domain });
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Woopra.prototype.load = function (callback) {
  load('//static.woopra.com/js/w.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Woopra.prototype.identify = function (id, traits, options) {
  if (id) traits.id = id;
  window.woopra.identify(traits).push(); // `push` sends it off async
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Woopra.prototype.track = function (event, properties, options) {
  window.woopra.track(event, properties);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Woopra.prototype.page = function (name, properties, options) {
  window.woopra.track('pv', {
    url: properties.url,
    title: name || properties.title
  });
};
});
require.register("analytics/lib/integrations/yandex-metrica.js", function(exports, require, module){

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `Metrica`.
 */

var Metrica = module.exports = integration('Yandex Metrica')
  .assumesPageview()
  .readyOnInitialize()
  .option('counterId', null);


/**
 * Exists?
 */

Metrica.prototype.exists = function () {
  return !! (window.yandex_metrika_callbacks ||
             (window.Ya && window.Ya.Metrika));
};


/**
 * Initialize.
 *
 * http://api.yandex.com/metrika/
 * https://metrica.yandex.com/22522351?step=2#tab=code
 */

Metrica.prototype.initialize = function () {
  var id = this.options.counterId;

  push(function () {
    window['yaCounter' + id] = new window.Ya.Metrika({ id: id });
  });

  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Metrica.prototype.load = function (callback) {
  load('//mc.yandex.ru/metrika/watch.js', callback);
};


/**
 * Push a new callback on the global Metrica queue.
 *
 * @param {Function} callback
 */

function push (callback) {
  window.yandex_metrika_callbacks = window.yandex_metrika_callbacks || [];
  window.yandex_metrika_callbacks.push(callback);
}
});










































require.alias("avetisk-defaults/index.js", "analytics/deps/defaults/index.js");
require.alias("avetisk-defaults/index.js", "defaults/index.js");

require.alias("component-clone/index.js", "analytics/deps/clone/index.js");
require.alias("component-clone/index.js", "clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("component-cookie/index.js", "analytics/deps/cookie/index.js");
require.alias("component-cookie/index.js", "cookie/index.js");

require.alias("component-domify/index.js", "analytics/deps/domify/index.js");
require.alias("component-domify/index.js", "domify/index.js");

require.alias("component-each/index.js", "analytics/deps/each/index.js");
require.alias("component-each/index.js", "each/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("component-emitter/index.js", "analytics/deps/emitter/index.js");
require.alias("component-emitter/index.js", "emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-event/index.js", "analytics/deps/event/index.js");
require.alias("component-event/index.js", "event/index.js");

require.alias("component-inherit/index.js", "analytics/deps/inherit/index.js");
require.alias("component-inherit/index.js", "inherit/index.js");

require.alias("component-object/index.js", "analytics/deps/object/index.js");
require.alias("component-object/index.js", "object/index.js");

require.alias("component-once/index.js", "analytics/deps/once/index.js");
require.alias("component-once/index.js", "once/index.js");

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

require.alias("ianstormtaylor-bind/index.js", "analytics/deps/bind/index.js");
require.alias("ianstormtaylor-bind/index.js", "bind/index.js");
require.alias("component-bind/index.js", "ianstormtaylor-bind/deps/bind/index.js");

require.alias("segmentio-bind-all/index.js", "ianstormtaylor-bind/deps/bind-all/index.js");
require.alias("component-bind/index.js", "segmentio-bind-all/deps/bind/index.js");

require.alias("component-type/index.js", "segmentio-bind-all/deps/type/index.js");

require.alias("ianstormtaylor-is/index.js", "analytics/deps/is/index.js");
require.alias("ianstormtaylor-is/index.js", "is/index.js");
require.alias("component-type/index.js", "ianstormtaylor-is/deps/type/index.js");

require.alias("ianstormtaylor-is-empty/index.js", "ianstormtaylor-is/deps/is-empty/index.js");

require.alias("jkroso-equals/index.js", "analytics/deps/equals/index.js");
require.alias("jkroso-equals/index.js", "equals/index.js");
require.alias("jkroso-type/index.js", "jkroso-equals/deps/type/index.js");

require.alias("segmentio-after/index.js", "analytics/deps/after/index.js");
require.alias("segmentio-after/index.js", "after/index.js");

require.alias("segmentio-alias/index.js", "analytics/deps/alias/index.js");
require.alias("segmentio-alias/index.js", "alias/index.js");
require.alias("component-type/index.js", "segmentio-alias/deps/type/index.js");

require.alias("segmentio-canonical/index.js", "analytics/deps/canonical/index.js");
require.alias("segmentio-canonical/index.js", "canonical/index.js");

require.alias("segmentio-convert-dates/index.js", "analytics/deps/convert-dates/index.js");
require.alias("segmentio-convert-dates/index.js", "convert-dates/index.js");
require.alias("component-clone/index.js", "segmentio-convert-dates/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("ianstormtaylor-is/index.js", "segmentio-convert-dates/deps/is/index.js");
require.alias("component-type/index.js", "ianstormtaylor-is/deps/type/index.js");

require.alias("ianstormtaylor-is-empty/index.js", "ianstormtaylor-is/deps/is-empty/index.js");

require.alias("segmentio-extend/index.js", "analytics/deps/extend/index.js");
require.alias("segmentio-extend/index.js", "extend/index.js");

require.alias("segmentio-is-email/index.js", "analytics/deps/is-email/index.js");
require.alias("segmentio-is-email/index.js", "is-email/index.js");

require.alias("segmentio-is-meta/index.js", "analytics/deps/is-meta/index.js");
require.alias("segmentio-is-meta/index.js", "is-meta/index.js");

require.alias("segmentio-isodate-traverse/index.js", "analytics/deps/isodate-traverse/index.js");
require.alias("segmentio-isodate-traverse/index.js", "isodate-traverse/index.js");
require.alias("component-clone/index.js", "segmentio-isodate-traverse/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("component-each/index.js", "segmentio-isodate-traverse/deps/each/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("ianstormtaylor-is/index.js", "segmentio-isodate-traverse/deps/is/index.js");
require.alias("component-type/index.js", "ianstormtaylor-is/deps/type/index.js");

require.alias("ianstormtaylor-is-empty/index.js", "ianstormtaylor-is/deps/is-empty/index.js");

require.alias("segmentio-isodate/index.js", "segmentio-isodate-traverse/deps/isodate/index.js");

require.alias("segmentio-json/index.js", "analytics/deps/json/index.js");
require.alias("segmentio-json/index.js", "json/index.js");
require.alias("component-json-fallback/index.js", "segmentio-json/deps/json-fallback/index.js");

require.alias("segmentio-load-date/index.js", "analytics/deps/load-date/index.js");
require.alias("segmentio-load-date/index.js", "load-date/index.js");

require.alias("segmentio-load-script/index.js", "analytics/deps/load-script/index.js");
require.alias("segmentio-load-script/index.js", "load-script/index.js");
require.alias("component-type/index.js", "segmentio-load-script/deps/type/index.js");

require.alias("segmentio-load-script-once/index.js", "analytics/deps/load-script-once/index.js");
require.alias("segmentio-load-script-once/index.js", "analytics/deps/load-script-once/index.js");
require.alias("segmentio-load-script-once/index.js", "load-script-once/index.js");
require.alias("component-find/index.js", "segmentio-load-script-once/deps/find/index.js");
require.alias("component-to-function/index.js", "component-find/deps/to-function/index.js");

require.alias("segmentio-load-script/index.js", "segmentio-load-script-once/deps/load-script/index.js");
require.alias("component-type/index.js", "segmentio-load-script/deps/type/index.js");

require.alias("segmentio-memoize-async/index.js", "segmentio-load-script-once/deps/memoize-async/index.js");
require.alias("segmentio-memoize-async/index.js", "segmentio-load-script-once/deps/memoize-async/index.js");
require.alias("timoxley-next-tick/index.js", "segmentio-memoize-async/deps/next-tick/index.js");

require.alias("segmentio-memoize-async/index.js", "segmentio-memoize-async/index.js");
require.alias("component-url/index.js", "segmentio-load-script-once/deps/url/index.js");

require.alias("visionmedia-debug/index.js", "segmentio-load-script-once/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "segmentio-load-script-once/deps/debug/debug.js");

require.alias("segmentio-load-script-once/index.js", "segmentio-load-script-once/index.js");
require.alias("segmentio-new-date/lib/index.js", "analytics/deps/new-date/lib/index.js");
require.alias("segmentio-new-date/lib/milliseconds.js", "analytics/deps/new-date/lib/milliseconds.js");
require.alias("segmentio-new-date/lib/seconds.js", "analytics/deps/new-date/lib/seconds.js");
require.alias("segmentio-new-date/lib/index.js", "analytics/deps/new-date/index.js");
require.alias("segmentio-new-date/lib/index.js", "new-date/index.js");
require.alias("ianstormtaylor-is/index.js", "segmentio-new-date/deps/is/index.js");
require.alias("component-type/index.js", "ianstormtaylor-is/deps/type/index.js");

require.alias("ianstormtaylor-is-empty/index.js", "ianstormtaylor-is/deps/is-empty/index.js");

require.alias("segmentio-isodate/index.js", "segmentio-new-date/deps/isodate/index.js");

require.alias("segmentio-new-date/lib/index.js", "segmentio-new-date/index.js");
require.alias("segmentio-on-body/index.js", "analytics/deps/on-body/index.js");
require.alias("segmentio-on-body/index.js", "on-body/index.js");
require.alias("component-each/index.js", "segmentio-on-body/deps/each/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("segmentio-on-error/index.js", "analytics/deps/on-error/index.js");
require.alias("segmentio-on-error/index.js", "on-error/index.js");

require.alias("segmentio-store.js/store.js", "analytics/deps/store/store.js");
require.alias("segmentio-store.js/store.js", "analytics/deps/store/index.js");
require.alias("segmentio-store.js/store.js", "store/index.js");
require.alias("segmentio-store.js/store.js", "segmentio-store.js/index.js");
require.alias("segmentio-to-unix-timestamp/index.js", "analytics/deps/to-unix-timestamp/index.js");
require.alias("segmentio-to-unix-timestamp/index.js", "to-unix-timestamp/index.js");

require.alias("segmentio-top-domain/index.js", "analytics/deps/top-domain/index.js");
require.alias("segmentio-top-domain/index.js", "analytics/deps/top-domain/index.js");
require.alias("segmentio-top-domain/index.js", "top-domain/index.js");
require.alias("component-url/index.js", "segmentio-top-domain/deps/url/index.js");

require.alias("segmentio-top-domain/index.js", "segmentio-top-domain/index.js");
require.alias("segmentio-use-https/index.js", "analytics/deps/use-https/index.js");
require.alias("segmentio-use-https/index.js", "use-https/index.js");

require.alias("timoxley-next-tick/index.js", "analytics/deps/next-tick/index.js");
require.alias("timoxley-next-tick/index.js", "next-tick/index.js");

require.alias("yields-prevent/index.js", "analytics/deps/prevent/index.js");
require.alias("yields-prevent/index.js", "prevent/index.js");

require.alias("yields-slug/index.js", "analytics/deps/slug/index.js");
require.alias("yields-slug/index.js", "slug/index.js");

require.alias("visionmedia-debug/index.js", "analytics/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "analytics/deps/debug/debug.js");
require.alias("visionmedia-debug/index.js", "debug/index.js");

require.alias("analytics/lib/index.js", "analytics/index.js");if (typeof exports == "object") {
  module.exports = require("analytics");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("analytics"); });
} else {
  this["analytics"] = require("analytics");
}})();
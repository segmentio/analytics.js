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
  var index = path + '/index.js';

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
  }

  if (require.aliases.hasOwnProperty(index)) {
    return require.aliases[index];
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
require.register("component-json/index.js", function(exports, require, module){

module.exports = 'undefined' == typeof JSON
  ? require('json-fallback')
  : JSON;

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
    port: a.port || location.port,
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

module.exports = function isEmail (string) {
    return (/.+\@.+\..+/).test(string);
};
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

    var https = document.location.protocol === 'https:';

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
require.register("segmentio-new-date/index.js", function(exports, require, module){
var type = require('type');


module.exports = function newDate (date) {
  // Milliseconds would be greater than 31557600000 (December 31, 1970).
  if ('number' === type(date) && date < 31557600000) date = date * 1000;

  // By default, delegate to Date, which will return `Invalid Date`s if wrong.
  return new Date(date);
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
require.register("analytics/src/index.js", function(exports, require, module){
// Analytics.js
//
// (c) 2013 Segment.io Inc.
// Analytics.js may be freely distributed under the MIT license.

var Analytics = require('./analytics')
  , providers = require('./providers');


module.exports = new Analytics(providers);
});
require.register("analytics/src/analytics.js", function(exports, require, module){
var after          = require('after')
  , bind           = require('event').bind
  , clone          = require('clone')
  , each           = require('each')
  , extend         = require('extend')
  , isMeta         = require('is-meta')
  , newDate        = require('new-date')
  , size           = require('object').length
  , preventDefault = require('prevent')
  , Provider       = require('./provider')
  , providers      = require('./providers')
  , querystring    = require('querystring')
  , type           = require('type')
  , url            = require('url')
  , user           = require('./user')
  , utils          = require('./utils');


module.exports = Analytics;


/**
 * Analytics.
 *
 * @param {Object} Providers - Provider classes that the user can initialize.
 */

function Analytics (Providers) {
  var self = this;

  this.VERSION = '0.9.15';

  each(Providers, function (Provider) {
    self.addProvider(Provider);
  });

  // Wrap `onload` with our own that will cache the loaded state of the page.
  var oldonload = window.onload;
  window.onload = function () {
    self.loaded = true;
    if ('function' === type(oldonload)) oldonload();
  };
}


/**
 * Extend the Analytics prototype.
 */

extend(Analytics.prototype, {

  // Whether `onload` has fired.
  loaded : false,

  // Whether `analytics` has been initialized.
  initialized : false,

  // Whether all of our analytics providers are ready to accept calls. Give it a
  // real jank name since we already use `analytics.ready` for the method.
  readied : false,

  // A queue for ready callbacks to run when our `readied` state becomes `true`.
  callbacks : [],

  // Milliseconds to wait for requests to clear before leaving the current page.
  timeout : 300,

  // A reference to the current user object.
  user : user,

  // The default Provider.
  Provider : Provider,

  // Providers that can be initialized. Add using `this.addProvider`.
  _providers : {},

  // The currently initialized providers.
  providers : [],


  /**
   * Add a provider to `_providers` to be initialized later.
   *
   * @param {String} name - The name of the provider.
   * @param {Function} Provider - The provider's class.
   */

  addProvider : function (Provider) {
    this._providers[Provider.prototype.name] = Provider;
  },


  /**
   * Initialize
   *
   * Call `initialize` to setup analytics.js before identifying or
   * tracking any users or events. For example:
   *
   *     analytics.initialize({
   *         'Google Analytics' : 'UA-XXXXXXX-X',
   *         'Segment.io'       : 'XXXXXXXXXXX',
   *         'KISSmetrics'      : 'XXXXXXXXXXX'
   *     });
   *
   * @param {Object} providers - a dictionary of the providers you want to
   * enable. The keys are the names of the providers and their values are either
   * an api key, or  dictionary of extra settings (including the api key).
   *
   * @param {Object} options (optional) - extra settings to initialize with.
   */

  initialize : function (providers, options) {
    var self = this;

    // Reset our state.
    this.providers = [];
    this.initialized = false;
    this.readied = false;

    // Set the user options, and load the user from our cookie.
    user.options(options);
    user.load();

    // Create a ready method that will call all of our ready callbacks after all
    // of our providers have been initialized and loaded. We'll pass the
    // function into each provider's initialize method, so they can callback
    // after they've loaded successfully.
    var ready = after(size(providers), function () {
      self.readied = true;
      var callback;
      while(callback = self.callbacks.shift()) {
        callback();
      }
    });

    // Initialize a new instance of each provider with their `options`, and
    // copy the provider into `this.providers`.
    each(providers, function (key, options) {
      var Provider = self._providers[key];
      if (!Provider) throw new Error('Couldnt find a provider named "'+key+'"');
      self.providers.push(new Provider(options, ready));
    });

    // Identify and track any `ajs_uid` and `ajs_event` parameters in the URL.
    var query = url.parse(window.location.href).query;
    var queries = querystring.parse(query);
    if (queries.ajs_uid) this.identify(queries.ajs_uid);
    if (queries.ajs_event) this.track(queries.ajs_event);

    // Update the initialized state that other methods rely on.
    this.initialized = true;
  },


  /**
   * Ready
   *
   * Add a callback that will get called when all of the analytics services you
   * initialize are ready to be called. It's like jQuery's `ready` except for
   * analytics instead of the DOM.
   *
   * If we're already ready, it will callback immediately.
   *
   * @param {Function} callback - The callback to attach.
   */

  ready : function (callback) {
    if (type(callback) !== 'function') return;
    if (this.readied) return callback();
    this.callbacks.push(callback);
  },


  /**
   * Identify
   *
   * Identifying a user ties all of their actions to an ID you recognize
   * and records properties about a user. For example:
   *
   *     analytics.identify('4d3ed089fb60ab534684b7e0', {
   *         name  : 'Achilles',
   *         email : 'achilles@segment.io',
   *         age   : 23
   *     });
   *
   * @param {String} userId (optional) - The ID you recognize the user by.
   * Ideally this isn't an email, because that might change in the future.
   *
   * @param {Object} traits (optional) - A dictionary of traits you know about
   * the user. Things like `name`, `age`, etc.
   *
   * @param {Object} options (optional) - Settings for the identify call.
   *
   * @param {Function} callback (optional) - A function to call after a small
   * timeout, giving the identify time to make requests.
   */

  identify : function (userId, traits, options, callback) {
    if (!this.initialized) return;

    // Allow for optional arguments.
    if (type(options) === 'function') {
      callback = options;
      options = undefined;
    }
    if (type(traits) === 'function') {
      callback = traits;
      traits = undefined;
    }
    if (type(userId) === 'object') {
      if (traits && type(traits) === 'function') callback = traits;
      traits = userId;
      userId = undefined;
    }

    // Use our cookied ID if they didn't provide one.
    if (userId === undefined || user === null) userId = user.id();

    // Update the cookie with the new userId and traits.
    var alias = user.update(userId, traits);

    // Clone `traits` before we manipulate it, so we don't do anything uncouth
    // and take the user.traits() so anonymous users carry over traits.
    traits = clone(user.traits());

    // Convert dates from more types of input into Date objects.
    if (traits && traits.created) traits.created = newDate(traits.created);
    if (traits && traits.company && traits.company.created) {
      traits.company.created = newDate(traits.company.created);
    }

    // Call `identify` on all of our enabled providers that support it.
    each(this.providers, function (provider) {
      if (provider.identify && isEnabled(provider, options)) {
        var args = [userId, clone(traits), clone(options)];
        if (provider.ready) {
          provider.identify.apply(provider, args);
        } else {
          provider.enqueue('identify', args);
        }
      }
    });

    // If we should alias, go ahead and do it.
    // if (alias) this.alias(userId);

    if (callback && type(callback) === 'function') {
      setTimeout(callback, this.timeout);
    }
  },


  /**
   * Track
   *
   * Record an event (or action) that your user has triggered. For example:
   *
   *     analytics.track('Added a Friend', {
   *         level  : 'hard',
   *         volume : 11
   *     });
   *
   * @param {String} event - The name of your event.
   *
   * @param {Object} properties (optional) - A dictionary of properties of the
   * event. `properties` are all camelCase (we'll automatically conver them to
   * the proper case each provider needs).
   *
   * @param {Object} options (optional) - Settings for the track call.
   *
   * @param {Function} callback - A function to call after a small
   * timeout, giving the identify time to make requests.
   */

  track : function (event, properties, options, callback) {
    if (!this.initialized) return;

    // Allow for optional arguments.
    if (type(options) === 'function') {
      callback = options;
      options = undefined;
    }
    if (type(properties) === 'function') {
      callback = properties;
      properties = undefined;
    }

    // Call `track` on all of our enabled providers that support it.
    each(this.providers, function (provider) {
      if (provider.track && isEnabled(provider, options)) {
        var args = [event, clone(properties), clone(options)];
        if (provider.ready) {
          provider.track.apply(provider, args);
        } else {
          provider.enqueue('track', args);
        }
      }
    });

    if (callback && type(callback) === 'function') {
      setTimeout(callback, this.timeout);
    }
  },


  /**
   * Track Link
   *
   * A helper for tracking outbound links that would normally navigate away from
   * the page before the track requests were made. It works by wrapping the
   * calls in a short timeout, giving the requests time to fire.
   *
   * @param {Element|Array} links - The link element or array of link elements
   * to bind to. (Allowing arrays makes it easy to pass in jQuery objects.)
   *
   * @param {String} event - Passed directly to `track`.
   *
   * @param {Object} properties (optional) - Passed directly to `track`.
   */

  trackLink : function (links, event, properties) {
    if (!links) return;

    // Turn a single link into an array so that we're always handling
    // arrays, which allows for passing jQuery objects.
    if ('element' === type(links)) links = [links];

    var self       = this
      , isFunction = 'function' === type(properties);

    each(links, function (el) {
      bind(el, 'click', function (e) {

        // Allow for properties to be a function. And pass it the
        // link element that was clicked.
        var props = isFunction ? properties(el) : properties;

        self.track(event, props);

        // To justify us preventing the default behavior we must:
        //
        // * Have an `href` to use.
        // * Not have a `target="_blank"` attribute.
        // * Not have any special keys pressed, because they might be trying to
        //   open in a new tab, or window, or download.
        //
        // This might not cover all cases, but we'd rather throw out an event
        // than miss a case that breaks the user experience.
        if (el.href && el.target !== '_blank' && !isMeta(e)) {

          preventDefault(e);

          // Navigate to the url after just enough of a timeout.
          setTimeout(function () {
            window.location.href = el.href;
          }, self.timeout);
        }
      });
    });
  },


  /**
   * Track Form
   *
   * Similar to `trackClick`, this is a helper for tracking form submissions
   * that would normally navigate away from the page before a track request can
   * be sent. It works by preventing the default submit event, sending our
   * track requests, and then submitting the form programmatically.
   *
   * @param {Element|Array} forms - The form element or array of form elements
   * to bind to. (Allowing arrays makes it easy to pass in jQuery objects.)
   *
   * @param {String} event - Passed directly to `track`.
   *
   * @param {Object} properties (optional) - Passed directly to `track`.
   */

  trackForm : function (form, event, properties) {
    if (!form) return;

    // Turn a single element into an array so that we're always handling arrays,
    // which allows for passing jQuery objects.
    if ('element' === type(form)) form = [form];

    var self       = this
      , isFunction = 'function' === type(properties);

    each(form, function (el) {
      var handler = function (e) {

        // Allow for properties to be a function. And pass it the form element
        // that was submitted.
        var props = isFunction ? properties(el) : properties;

        self.track(event, props);

        preventDefault(e);

        // Submit the form after a timeout, giving the event time to fire.
        setTimeout(function () {
          el.submit();
        }, self.timeout);
      };

      // Support the form being submitted via jQuery instead of for real. This
      // doesn't happen automatically because `el.submit()` doesn't actually
      // fire submit handlers, which is what jQuery uses internally. >_<
      var dom = window.jQuery || window.Zepto;
      if (dom) {
        dom(el).submit(handler);
      } else {
        bind(el, 'submit', handler);
      }
    });
  },


  /**
   * Pageview
   *
   * Simulate a pageview in single-page applications, where real pageviews don't
   * occur. This isn't support by all providers.
   *
   * @param {String} url (optional) - The path of the page (eg. '/login'). Most
   * providers will default to the current pages URL, so you don't need this.
   */

  pageview : function (url) {
    if (!this.initialized) return;

    // Call `pageview` on all of our enabled providers that support it.
    each(this.providers, function (provider) {
      if (provider.pageview) {
        var args = [url];
        if (provider.ready) {
          provider.pageview.apply(provider, args);
        } else {
          provider.enqueue('pageview', args);
        }
      }
    });
  },


  /**
   * Alias
   *
   * Merges two previously unassociate user identities. This comes in handy if
   * the same user visits from two different devices and you want to combine
   * their analytics history.
   *
   * Some providers don't support merging users.
   *
   * @param {String} newId - The new ID you want to recognize the user by.
   *
   * @param {String} originalId (optional) - The original ID that the user was
   * recognized by. This defaults to the current identified user's ID if there
   * is one. In most cases you don't need to pass in the `originalId`.
   */

  alias : function (newId, originalId, options) {
    if (!this.initialized) return;

    if (type(originalId) === 'object') {
      options    = originalId;
      originalId = undefined;
    }

    // Call `alias` on all of our enabled providers that support it.
    each(this.providers, function (provider) {
      if (provider.alias && isEnabled(provider, options)) {
        var args = [newId, originalId];
        if (provider.ready) {
          provider.alias.apply(provider, args);
        } else {
          provider.enqueue('alias', args);
        }
      }
    });
  },


  /**
   * Log
   *
   * Log an error to analytics providers that support it, like Sentry.
   *
   * @param {Error|String} error - The error or string to log.
   * @param {Object} properties - Properties about the error.
   * @param {Object} options (optional) - Settings for the log call.
   */

  log : function (error, properties, options) {
    if (!this.initialized) return;

    each(this.providers, function (provider) {
      if (provider.log && isEnabled(provider, options)) {
        var args = [error, properties, options];
        if (provider.ready) {
          provider.log.apply(provider, args);
        } else {
          provider.enqueue('log', args);
        }
      }
    });
  }

});


/**
 * Backwards compatibility.
 */

// Alias `trackClick` and `trackSubmit`.
Analytics.prototype.trackClick = Analytics.prototype.trackLink;
Analytics.prototype.trackSubmit = Analytics.prototype.trackForm;


/**
 * Determine whether a provider is enabled or not based on the options object.
 *
 * @param {Object} provider - the current provider.
 * @param {Object} options - the current call's options.
 *
 * @return {Boolean} - wether the provider is enabled.
 */

var isEnabled = function (provider, options) {
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
};

});
require.register("analytics/src/provider.js", function(exports, require, module){
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

function Provider (options, ready) {
  var self = this;

  // Make a queue of `{ method : 'identify', args : [] }` to unload once ready.
  this.queue = [];
  this.ready = false;

  // Allow for `options` to only be a string if the provider has specified
  // a default `key`, in which case convert `options` into a dictionary.
  if (type(options) !== 'object') {
    if (type(options) === 'string' && this.key) {
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
require.register("analytics/src/user.js", function(exports, require, module){
var cookieStore = require('cookie')
  , clone       = require('clone')
  , extend      = require('extend')
  , json        = require('json')
  , type        = require('type');


/**
 * Make a new user.
 */

var user = newUser();


/**
 * Default cookie settings.
 */

var cookie = exports.cookie = {
  name    : 'ajs_user',
  maxage  : 31536000000, // default to a year
  enabled : true,
  path    : '/',
};


/**
 * Set the options for our user storage.
 *
 * @param {Object} options - settings.
 *
 *   @field {Boolean|Object} cookie - whether to use a cookie.
 *     @field {String} name - what to call the cookie (eg. 'ajs_user').
 *     @field {Number} maxage - expiration time in milliseconds for the cookie,
 *     defaulting to one year.
 *     @field {
 */

exports.options = function (options) {
  options || (options = {});

  // Support just passing in a boolean for cookie.
  if ('boolean' === type(options.cookie)) {
    cookie.enabled = options.cookie;
  }

  else if ('object' === type(options.cookie)) {
    cookie.enabled = true;
    if (options.cookie.name)   cookie.name   = options.cookie.name;
    if (options.cookie.maxage) cookie.maxage = options.cookie.maxage;
    if (options.cookie.domain) cookie.domain = options.cookie.domain;
    if (options.cookie.path)   cookie.path   = options.cookie.path;

    if (cookie.domain && cookie.domain.charAt(0) !== '.') {
      cookie.domain = '.' + cookie.domain;
    }
  }
};


/**
 * Get the current user's ID.
 */

exports.id = function () {
  return user.id;
};


/**
 * Get the current user's traits.
 */

exports.traits = function () {
  return clone(user.traits);
};


/**
 * Updates the current stored user with id and traits.
 *
 * @param {String} userId - the new user ID.
 * @param {Object} traits - any new traits.
 *
 * @return {Boolean} whether alias should be called.
 */

exports.update = function (userId, traits) {

  // Make an alias call if there was no previous userId, there is one
  // now, and we are using a cookie between page loads.
  var alias = !user.id && userId && cookie.enabled;

  traits || (traits = {});

  // If there is a current user and the new user isn't the same,
  // we want to just replace their traits. Otherwise extend.
  if (user.id && userId && user.id !== userId) user.traits = traits;
  else extend(user.traits, traits);

  if (userId) user.id = userId;

  if (cookie.enabled) save(user);

  return alias;
};


/**
 * Clears the user and wipes the cookie.
 */

exports.clear = function () {
  if (cookie.enabled) cookieStore(cookie.name, null, clone(cookie));
  user = newUser();
};


/**
 * Save the user object to a cookie
 *
 * @param {Object} user
 *
 * @return {Boolean} saved
 */

var save = function (user) {
  try {
    cookieStore(cookie.name, json.stringify(user), clone(cookie));
    return true;
  } catch (e) {
    return false;
  }
};


/**
 * Load the data from our cookie.
 *
 * @return {Object} - the current user.
 *   @field {String} id - the current user's ID.
 *   @field {Object} traits - the current user's traits.
 */

exports.load = function () {
  if (!cookie.enabled) return user;

  var storedUser = cookieStore(cookie.name);
  if (storedUser) {
    try {
      user = json.parse(storedUser);
    } catch (e) {
      // If we got bad JSON, start from scratch.
      user = newUser();
    }
  }

  return user;
};


/**
 * Returns a new user object.
 */

function newUser() {
  return {
    id : null,
    traits : {}
  };
}
});
require.register("analytics/src/utils.js", function(exports, require, module){
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
require.register("analytics/src/providers/adroll.js", function(exports, require, module){
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
require.register("analytics/src/providers/bitdeli.js", function(exports, require, module){
// https://bitdeli.com/docs
// https://bitdeli.com/docs/javascript-api.html

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Bitdeli',

  defaults : {
    // BitDeli requires two options: `inputId` and `authToken`.
    inputId : null,
    authToken : null,
    // Whether or not to track an initial pageview when the page first
    // loads. You might not want this if you're using a single-page app.
    initialPageview : true
  },


  initialize : function (options, ready) {
    window._bdq = window._bdq || [];
    window._bdq.push(["setAccount", options.inputId, options.authToken]);

    if (options.initialPageview) this.pageview();

    load('//d2flrkr957qc5j.cloudfront.net/bitdeli.min.js');

    // Bitdeli just uses a queue, so it's ready right away.
    ready();
  },


  // Bitdeli uses two separate methods: `identify` for storing the `userId`
  // and `set` for storing `traits`.
  identify : function (userId, traits) {
    if (userId) window._bdq.push(['identify', userId]);
    if (traits) window._bdq.push(['set', traits]);
  },


  track : function (event, properties) {
    window._bdq.push(['track', event, properties]);
  },


  // If `url` is undefined, Bitdeli uses the current page URL instead.
  pageview : function (url) {
    window._bdq.push(['trackPageview', url]);
  }

});
});
require.register("analytics/src/providers/bugherd.js", function(exports, require, module){
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
require.register("analytics/src/providers/chartbeat.js", function(exports, require, module){
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
require.register("analytics/src/providers/clicktale.js", function(exports, require, module){
// http://wiki.clicktale.com/Article/JavaScript_API

var date     = require('load-date')
  , Provider = require('../provider')
  , load     = require('load-script');

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

    // ClickTale wants this at the "top" of the page. The
    // analytics.js snippet sets this date synchronously now,
    // and  makes it available via load-date.
    window.WRInitTime = date.getTime();


    // Make the `<div>` element and insert it at the end of the body.
    var createClickTaleDiv = function () {
      // loop until the body is actually available
      if (!document.body) return setTimeout(createClickTaleDiv, 5);

      var div = document.createElement('div');
      div.setAttribute('id', 'ClickTaleDiv');
      div.setAttribute('style', 'display: none;');
      document.body.appendChild(div);
    };
    createClickTaleDiv();

    var onloaded = function () {
      window.ClickTale(options.projectId, options.recordingRatio, options.partitionId);
      ready();
    };

    // Load the appropriate CDN library, if no
    // ssl library is provided and we're on ssl then
    // we can't load anything (always true for non-premium accounts.)
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
require.register("analytics/src/providers/clicky.js", function(exports, require, module){
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
require.register("analytics/src/providers/comscore.js", function(exports, require, module){
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
require.register("analytics/src/providers/crazyegg.js", function(exports, require, module){
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
require.register("analytics/src/providers/customerio.js", function(exports, require, module){
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

    traits || (traits = {});

    // Customer.io takes the `userId` as part of the traits object.
    traits.id = userId;

    // If there wasn't already an email and the userId is one, use it.
    if (!traits.email && isEmail(userId)) traits.email = userId;

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
require.register("analytics/src/providers/errorception.js", function(exports, require, module){
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
    traits || (traits = {});
    if (userId) traits.id = userId;

    // Add all of the traits as metadata.
    extend(window._errs.meta, traits);
  }

});
});
require.register("analytics/src/providers/foxmetrics.js", function(exports, require, module){
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
    // A `userId` is required for profile updates, otherwise its a waste of
    // resources as nothing will get updated.
    if (!userId) return;

    // FoxMetrics needs the first and last name seperately.
    var firstName = null
      , lastName  = null
      , email     = null;

    if (traits && traits.name) {
      firstName = traits.name.split(' ')[0];
      lastName = traits.name.split(' ')[1];
    }
    if (traits && traits.email) {
      email = traits.email;
    }

    // We should probably remove name and email before passing as attributes.
    window._fxm.push([
      '_fxm.visitor.profile',
      userId,        // user id
      firstName,     // first name
      lastName,      // last name
      email,         // email
      null,          // address
      null,          // social
      null,          // partners
      traits || null // attributes
    ]);
  },

  track : function (event, properties) {
    window._fxm.push([
      event,     // event name
      null,      // category
      properties // properties
    ]);
  },

  pageview : function (url) {
    window._fxm.push([
      '_fxm.pages.view',
      null,        // title
      null,        // name
      null,        // category
      url || null, // url
      null         // referrer
    ]);
  }

});
});
require.register("analytics/src/providers/gauges.js", function(exports, require, module){
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
require.register("analytics/src/providers/google-analytics.js", function(exports, require, module){
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
    universalClient: false,
    // Your Google Analytics Tracking ID.
    trackingId : null,
    // Whether or not to track and initial pageview when initialized.
    initialPageview : true,
    // An optional domain setting, to restrict where events can originate from.
    domain : null,
    // Whether to anonymize the IP address collected for the user.
    anonymizeIp : false,
    // Whether to use Google Analytics's Enhanced Link Attribution feature:
    // http://support.google.com/analytics/bin/answer.py?hl=en&answer=2558867
    enhancedLinkAttribution : false,
    // The setting to use for Google Analytics's Site Speed Sample Rate feature:
    // https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate
    siteSpeedSampleRate : null,
    // Whether to enable GOogle's DoubleClick remarketing feature.
    doubleClick : false,
    // A domain to ignore for referrers. Maps to _addIgnoredRef
    ignoreReferrer : null
  },

  //
  // Initialize
  //

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

    // URLs change if DoubleClick is on.
    if (options.doubleClick) {
      load('//stats.g.doubleclick.net/dc.js');
    } else {
      load({
        http  : 'http://www.google-analytics.com/ga.js',
        https : 'https://ssl.google-analytics.com/ga.js'
      });
    }

    // Google makes a queue so it's ready immediately.
    ready();
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

  //
  // Track
  //

  track : function (event, properties) {

    properties || (properties = {});

    var value;

    // Since value is a common property name, ensure it is a number
    if (type(properties.value) === 'number') value = properties.value;

    // Try to check for a `category` and `label`. A `category` is required,
    // so if it's not there we use `'All'` as a default. We can safely push
    // undefined if the special properties don't exist. Try using revenue
    // first, but fall back to a generic `value` as well.
    if (this.options.universalClient) {

      var opts = {};
      if (properties.noninteraction)
        opts.nonInteraction = properties.noninteraction;

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


  //
  // Page View
  //

  pageview : function (url) {
    if (this.options.universalClient) {
      window[this.global]('send', 'pageview', url);
    } else {
      window._gaq.push(['_trackPageview', url]);
    }
  }

});
});
require.register("analytics/src/providers/gosquared.js", function(exports, require, module){
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
require.register("analytics/src/providers/heap.js", function(exports, require, module){
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
require.register("analytics/src/providers/hittail.js", function(exports, require, module){
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
require.register("analytics/src/providers/hubspot.js", function(exports, require, module){
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
    // If there wasn't already an email and the userId is one, use it.
    if ((!traits || !traits.email) && isEmail(userId)) {
      traits || (traits = {});
      traits.email = userId;
    }

    // Still don't have any traits? Get out.
    if (!traits) return;

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
require.register("analytics/src/providers/index.js", function(exports, require, module){
module.exports = [
  require('./adroll'),
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
  require('./google-analytics'),
  require('./gosquared'),
  require('./heap'),
  require('./hittail'),
  require('./hubspot'),
  require('./intercom'),
  require('./keen-io'),
  require('./kissmetrics'),
  require('./klaviyo'),
  require('./livechat'),
  require('./lytics'),
  require('./mixpanel'),
  require('./olark'),
  require('./perfect-audience'),
  require('./pingdom'),
  require('./qualaroo'),
  require('./quantcast'),
  require('./sentry'),
  require('./snapengage'),
  require('./usercycle'),
  require('./userfox'),
  require('./uservoice'),
  require('./vero'),
  require('./woopra')
];
});
require.register("analytics/src/providers/intercom.js", function(exports, require, module){
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
    load('https://api.intercom.io/api/js/library.js', ready);
  },

  identify : function (userId, traits, context) {
    // Intercom requires a `userId` to associate data to a user.
    if (!userId) return;

    // Don't do anything if we just have traits.
    if (!this.booted && !userId) return;

    // Pass traits directly in to Intercom's `custom_data`.
    var settings = extend({
      custom_data : traits || {}
    }, (context && context.intercom) ? context.intercom : {});

    // They need `created_at` as a Unix timestamp (seconds).
    if (traits && traits.created) {
      settings.created_at = Math.floor(traits.created/1000);
      delete traits.created;
    }

    // Pull out an email field. Falling back to the `userId` if possible.
    if (traits && traits.email) {
      settings.email = traits.email;
      delete traits.email;
    } else if (isEmail(userId)) {
      settings.email = userId;
    }

    // Pull out a name field, or combine one from `firstName` and `lastName`.
    if (traits && traits.name) {
      settings.name = traits.name;
      delete traits.name;
    } else if (traits && traits.firstName && traits.lastName) {
      settings.name = traits.firstName + ' ' + traits.lastName;
    }

    // Pull out a company field, with it's own optional `created` date.
    if (traits && traits.company) {
      if (traits.company.created) {
        traits.company.created_at = Math.floor(traits.company.created/1000);
        delete traits.company.created;
      }
      settings.company = traits.company;
      delete traits.company;
    }

    // Optionally add the inbox widget.
    if (this.options.activator) {
      settings.widget = {
        activator   : this.options.activator,
        use_counter : this.options.counter
      };
    }

    // If this is the first time we've identified, `boot` instead of `update`
    // and add our one-time boot settings.
    if (this.booted) {
      window.Intercom('update', settings);
    } else {
      extend(settings, {
        app_id    : this.options.appId,
        user_id   : userId
      });

      if (this.options.userHash)
        settings.user_hash = this.options.userHash;

      window.Intercom('boot', settings);
    }

    // Set the booted state, so that we know to call 'update' next time.
    this.booted = true;
  }

});

});
require.register("analytics/src/providers/keen-io.js", function(exports, require, module){
// https://keen.io/docs/

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Keen IO',

  defaults : {
    // Keen IO has one required option: `projectToken`
    projectToken : null,
    // Whether or not to pass pageviews on to Keen IO.
    pageview : true,
    // Whether or not to track an initial pageview on `initialize`.
    initialPageview : true
  },

  initialize : function (options, ready) {
    window.Keen = window.Keen||{configure:function(a,b,c){this._pId=a;this._ak=b;this._op=c},addEvent:function(a,b,c,d){this._eq=this._eq||[];this._eq.push([a,b,c,d])},setGlobalProperties:function(a){this._gp=a},onChartsReady:function(a){this._ocrq=this._ocrq||[];this._ocrq.push(a)}};
    window.Keen.configure(options.projectToken);

    load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.0.0-min.js');

    if (options.initialPageview) this.pageview();

    // Keen IO defines all their functions in the snippet, so they
    // are ready immediately.
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
require.register("analytics/src/providers/kissmetrics.js", function(exports, require, module){
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
require.register("analytics/src/providers/klaviyo.js", function(exports, require, module){
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
    if (!userId && !traits) return;

    // Klaviyo takes the user ID on the traits object itself.
    traits || (traits = {});
    if (userId) traits.$id = userId;

    window._learnq.push(['identify', traits]);
  },

  track : function (event, properties) {
    window._learnq.push(['track', event, properties]);
  }

});
});
require.register("analytics/src/providers/livechat.js", function(exports, require, module){
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

    // We need either a `userId` or `traits`.
    if (!userId && !traits) return;

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
require.register("analytics/src/providers/lytics.js", function(exports, require, module){
// Lytics
// --------
// [Documentation](http://developer.lytics.io/doc#jstag),

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

    name : 'Lytics',

    key : 'cid',

    defaults : {
        cid: null
    },


    initialize : function (options, ready) {
        window.jstag = (function () {
          var t={_q:[],_c:{cid:options.cid,url:'//c.lytics.io'},ts:(new Date()).getTime()};
          t.send=function(){
            this._q.push(["ready","send",Array.prototype.slice.call(arguments)]);
            return this;
          };
          return t;
        })();

        load('//c.lytics.io/static/io.min.js');

        // ready immediately
        ready();
    },


    // Identify
    // --------

    identify: function (userId, traits) {
        traits['_uid'] = userId;
        window.jstag.send(traits);
    },


    // Track
    // -----

    track: function (event, properties) {
        properties['_e'] = event;
        window.jstag.send(properties);
    },

    // Pageview
    // ----------
    pageview: function (url) {
        window.jstag.send();
    }


});




});
require.register("analytics/src/providers/mixpanel.js", function(exports, require, module){
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
    initialPageview : false
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

      // Pass options directly to `init` as the second argument.
      window.mixpanel.init(options.token, options);

      if (options.initialPageview) this.pageview();
  },

  identify : function (userId, traits) {
    // If we have an email and no email trait, set the email trait.
    if (userId && isEmail(userId) && (traits && !traits.email)) {
      traits || (traits = {});
      traits.email = userId;
    }

    // Alias the traits' keys with dollar signs for Mixpanel's API.
    if (traits) {
      alias(traits, {
        'created'   : '$created',
        'email'     : '$email',
        'firstName' : '$first_name',
        'lastName'  : '$last_name',
        'lastSeen'  : '$last_seen',
        'name'      : '$name',
        'username'  : '$username'
      });
    }

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
require.register("analytics/src/providers/olark.js", function(exports, require, module){
// http://www.olark.com/documentation

var Provider = require('../provider')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  name : 'Olark',

  key : 'siteId',

  chatInProgress : false,

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
    window.olark('api.box.onExpand', function () {
      self.chatInProgress = true;
    });
    window.olark('api.box.onShrink', function () {
      self.chatInProgress = false;
    });

    // Olark creates all of it's method in the snippet, so it's ready
    // immediately.
    ready();
  },

  // Olark isn't an analytics service, but we can use the `userId` and
  // `traits` to tag the user with their real name in the chat console.
  identify : function (userId, traits) {
    if (!this.options.identify) return;

    // Make an empty default traits object if it doesn't exist yet.
    traits || (traits = {});

    // If there wasn't already an email and the userId is one, use it.
    if (!traits.email && isEmail(userId)) traits.email = userId;

    // Set the email address for the user.
    if (traits.email)
      window.olark('api.visitor.updateEmailAddress', { emailAddress : traits.email });

    // Set the full name for the user.
    if (traits.name)
      window.olark('api.visitor.updateFullName', { fullName : traits.name });
    else if (traits.firstName && traits.lastName)
      window.olark('api.visitor.updateFullName', { fullName : traits.firstName + ' ' + traits.lastName });

    // Set the phone number for the user.
    if (traits.phone)
      window.olark('api.visitor.updatePhoneNumber', { phoneNumber : traits.phone });

    // Set any additional custom fields from the traits.
    window.olark('api.visitor.updateCustomFields', traits);

    // Choose the best possible nickname for the user.
    var nickname = userId;
    if (traits.email) nickname = traits.email;
    if (traits.name) nickname = traits.name;
    if (traits.name && traits.email) nickname += ' ('+traits.email+')';

    // If we ended up with no nickname after all that, get out of here.
    if (!nickname) return;

    window.olark('api.chat.updateVisitorNickname', {
      snippet : nickname
    });
  },

  // Again, all we're doing is logging events the user triggers to the chat
  // console, if you so desire it.
  track : function (event, properties) {
    if (!this.options.track || !this.chatInProgress) return;

    // To stay consistent with olark's default messages, it's all lowercase.
    window.olark('api.chat.sendNotificationToOperator', {
      body : 'visitor triggered "'+event+'"'
    });
  },

  // Again, not analytics, but we can mimic the functionality Olark has for
  // normal pageviews with pseudo-pageviews, telling the operator when a
  // visitor changes pages.
  pageview : function (url) {
    if (!this.options.pageview || !this.chatInProgress) return;

    // To stay consistent with olark's default messages, it's all lowercase.
    window.olark('api.chat.sendNotificationToOperator', {
      body : 'looking at ' + window.location.href
    });
  }

});
});
require.register("analytics/src/providers/perfect-audience.js", function(exports, require, module){
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
require.register("analytics/src/providers/pingdom.js", function(exports, require, module){
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

    window._prum = [['id', '5168f8c6abe53db732000000'],
                 ['mark', 'firstbyte', date.getTime()]];

    // We've replaced the original snippet loader with our own load method.
    load('//rum-static.pingdom.net/prum.min.js', ready);
  }

});
});
require.register("analytics/src/providers/qualaroo.js", function(exports, require, module){
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
    var identity = userId;
    if (traits && traits.email && !isEmail(userId)) identity = traits.email;
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
require.register("analytics/src/providers/quantcast.js", function(exports, require, module){
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
require.register("analytics/src/providers/sentry.js", function(exports, require, module){
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
    traits || (traits = {});
    if (userId) traits.id = userId;
    window.Raven.setUser(traits);
  },

  // Raven will automatically use `captureMessage` if the error is a string.
  log : function (error, properties) {
    window.Raven.captureException(error, properties);
  }

});
});
require.register("analytics/src/providers/snapengage.js", function(exports, require, module){
// http://help.snapengage.com/installation-guide-getting-started-in-a-snap/

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'SnapEngage',

  key : 'apiKey',

  defaults : {
    apiKey : null
  },

  initialize : function (options, ready) {
    load('//commondatastorage.googleapis.com/code.snapengage.com/js/' + options.apiKey + '.js', ready);
  }

});
});
require.register("analytics/src/providers/usercycle.js", function(exports, require, module){
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
  },

  track : function (event, properties) {
    // Usercycle seems to use traits instead of properties.
    var traits = user.traits();
    window._uc.push(['action', event, traits]);
  }

});
});
require.register("analytics/src/providers/userfox.js", function(exports, require, module){
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

    // userfox creates its own queue, so we're ready right away
    ready();
  },

  identify : function (userId, traits, context) {
    // userfox requires an email.
    var email;
    if (userId && isEmail(userId)) email = userId;
    if (traits && isEmail(traits.email)) email = traits.email;
    if (!email) return;

    // Initialize the library with the email now that we have it.
    window._ufq.push(['init', {
      clientId : this.options.clientId,
      email    : email
    }]);

    // Record traits to "track" if we have the required signup date "created".
    if (traits && traits.created) {
      traits.signup_date = traits.created.getTime()+'';
      window._ufq.push(['track', traits]);
    }
  }

});

});
require.register("analytics/src/providers/uservoice.js", function(exports, require, module){
// http://feedback.uservoice.com/knowledgebase/articles/225-how-do-i-pass-custom-data-through-the-widget-and-i

var Provider = require('../provider')
  , load     = require('load-script')
  , alias    = require('alias')
  , clone    = require('clone');


module.exports = Provider.extend({

  name : 'UserVoice',

  defaults : {
    // These first two options are required.
    widgetId          : null,
    forumId           : null,
    // Should we show the tab automatically?
    showTab           : true,
    // There's tons of options for the tab.
    mode              : 'full',
    primaryColor      : '#cc6d00',
    linkColor         : '#007dbf',
    defaultMode       : 'support',
    supportTabName    : null,
    feedbackTabName   : null,
    tabLabel          : 'Feedback & Support',
    tabColor          : '#cc6d00',
    tabPosition       : 'middle-right',
    tabInverted       : false
  },

  initialize : function (options, ready) {
    window.UserVoice = window.UserVoice || [];
    load('//widget.uservoice.com/' + options.widgetId + '.js', ready);

    var optionsClone = clone(options);
    alias(optionsClone, {
      'forumId'         : 'forum_id',
      'primaryColor'    : 'primary_color',
      'linkColor'       : 'link_color',
      'defaultMode'     : 'default_mode',
      'supportTabName'  : 'support_tab_name',
      'feedbackTabName' : 'feedback_tab_name',
      'tabLabel'        : 'tab_label',
      'tabColor'        : 'tab_color',
      'tabPosition'     : 'tab_position',
      'tabInverted'     : 'tab_inverted'
    });

    // If we don't automatically show the tab, let them show it via
    // javascript. This is the default name for the function in their snippet.
    window.showClassicWidget = function (showWhat) {
      window.UserVoice.push([showWhat || 'showLightbox', 'classic_widget', optionsClone]);
    };

    // If we *do* automatically show the tab, get on with it!
    if (options.showTab) {
      window.showClassicWidget('showTab');
    }
  },

  identify : function (userId, traits) {
    // Pull the ID into traits.
    traits.id = userId;

    window.UserVoice.push(['setCustomFields', traits]);
  }

});
});
require.register("analytics/src/providers/vero.js", function(exports, require, module){
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
    load('//www.getvero.com/assets/m.js');

    // Vero creates a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    // Don't do anything if we just have traits, because Vero
    // requires a `userId`.
    if (!userId) return;

    traits || (traits = {});

    // Vero takes the `userId` as part of the traits object.
    traits.id = userId;

    // If there wasn't already an email and the userId is one, use it.
    if (!traits.email && isEmail(userId)) traits.email = userId;

    // Vero *requires* an email and an id
    if (!traits.id || !traits.email) return;

    window._veroq.push(['user', traits]);
  },

  track : function (event, properties) {
    window._veroq.push(['track', event, properties]);
  }

});
});
require.register("analytics/src/providers/woopra.js", function(exports, require, module){
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
    domain : null
  },

  initialize : function (options, ready) {
    // Woopra gives us a nice ready callback.
    var self = this;

    window.woopraReady = function (tracker) {
      tracker.setDomain(self.options.domain);
      tracker.setIdleTimeout(300000);

      var userId = user.id()
        , traits = user.traits();

      self.addTraits(userId, traits, tracker);

      tracker.track();

      ready();
      return false;
    };

    load('//static.woopra.com/js/woopra.js');
  },

  identify : function (userId, traits) {

    if (!window.woopraTracker) return;

    this.addTraits(userId, traits, window.woopraTracker);
  },

  // Convenience function for updating the userId and traits.
  addTraits : function (userId, traits, tracker) {

    var addTrait = tracker.addVisitorProperty;

    if (userId) addTrait('id', userId);
    if (isEmail(userId)) addTrait('email', userId);

    // Seems to only support strings
    each(traits, function (name, trait) {
      if (type(trait) === 'string') addTrait(name, trait);
    });
  },

  track : function (event, properties) {
    // We aren't guaranteed a tracker.
    if (!window.woopraTracker) return;

    // Woopra takes its event as dictionaries with the `name` key.
    var settings = {};
    settings.name = event;

    // If we have properties, add them to the settings.
    if (properties) settings = extend({}, properties, settings);

    window.woopraTracker.pushEvent(settings);
  }

});
});
require.alias("component-clone/index.js", "analytics/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("component-cookie/index.js", "analytics/deps/cookie/index.js");

require.alias("component-each/index.js", "analytics/deps/each/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("component-event/index.js", "analytics/deps/event/index.js");

require.alias("component-json/index.js", "analytics/deps/json/index.js");

require.alias("component-json-fallback/index.js", "analytics/deps/json-fallback/index.js");

require.alias("component-object/index.js", "analytics/deps/object/index.js");

require.alias("component-querystring/index.js", "analytics/deps/querystring/index.js");
require.alias("component-trim/index.js", "component-querystring/deps/trim/index.js");

require.alias("component-type/index.js", "analytics/deps/type/index.js");

require.alias("component-url/index.js", "analytics/deps/url/index.js");

require.alias("segmentio-after/index.js", "analytics/deps/after/index.js");

require.alias("segmentio-alias/index.js", "analytics/deps/alias/index.js");

require.alias("segmentio-canonical/index.js", "analytics/deps/canonical/index.js");

require.alias("segmentio-extend/index.js", "analytics/deps/extend/index.js");

require.alias("segmentio-is-email/index.js", "analytics/deps/is-email/index.js");

require.alias("segmentio-is-meta/index.js", "analytics/deps/is-meta/index.js");

require.alias("segmentio-load-date/index.js", "analytics/deps/load-date/index.js");

require.alias("segmentio-load-script/index.js", "analytics/deps/load-script/index.js");
require.alias("component-type/index.js", "segmentio-load-script/deps/type/index.js");

require.alias("segmentio-new-date/index.js", "analytics/deps/new-date/index.js");
require.alias("component-type/index.js", "segmentio-new-date/deps/type/index.js");

require.alias("segmentio-on-body/index.js", "analytics/deps/on-body/index.js");
require.alias("component-each/index.js", "segmentio-on-body/deps/each/index.js");
require.alias("component-type/index.js", "component-each/deps/type/index.js");

require.alias("yields-prevent/index.js", "analytics/deps/prevent/index.js");

require.alias("analytics/src/index.js", "analytics/index.js");

if (typeof exports == "object") {
  module.exports = require("analytics");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("analytics"); });
} else {
  this["analytics"] = require("analytics");
}})();
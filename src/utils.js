
var type  = require('type')
  , each  = require('each')
  , clone = require('clone');


exports.clone = clone;

// A helper to alias certain object's keys to different key names.
// Useful for abstracting over providers that require specific key
// names.
exports.alias = function (obj, aliases) {
  if (isObject(obj)) return;

  each(aliases, function (property, alias) {
    if (obj[property] !== undefined) {
      obj[alias] = obj[property];
      delete obj[property];
    }
  });
};


// Attach an event handler to a DOM element, even in IE.
exports.bind = function (el, event, callback) {
  if (el.addEventListener) {
    el.addEventListener(event, callback, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + event, callback);
  }
};

// Given a DOM event, tell us whether a meta key or button was
// pressed that would make a link open in a new tab, window,
// start a download, or anything else that wouldn't take the user to
// a new page.
exports.isMeta = function (e) {
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

// Given a timestamp, return its value in seconds. For providers
// that rely on Unix time instead of millis.
exports.getSeconds = function (time) {
  return Math.floor((+(new Date(time))) / 1000);
};

// A helper to extend objects with properties from other objects.
// Based off of the [underscore](https://github.com/documentcloud/underscore/blob/master/underscore.js#L763)
// method.
exports.extend = function (obj) {
  if (!isObject(obj)) return;

  var args = Array.prototype.slice.call(arguments, 1);
  each(args, function (source) {
    if (!isObject(source)) return;

    each(source, function (key, property) {
      obj[key] = property;
    });
  });

  return obj;
};

// Type detection helpers, copied from
// [underscore](https://github.com/documentcloud/underscore/blob/master/underscore.js#L926-L946).
exports.isElement = function(obj) {
  return !!(obj && obj.nodeType === 1);
};


exports.isArray = Array.isArray || function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

var isObject = exports.isObject = function (obj) {
  return obj === Object(obj);
};

var isString = exports.isString = function (obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};

exports.isFunction = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
};

exports.isNumber = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
};


// Email detection helper to loosely validate emails.
exports.isEmail = function (string) {
  return (/.+\@.+\..+/).test(string);
};


// A helper to resolve a settings object. It allows for `settings`
// to be a string in the case of using the shorthand where just an
// api key is passed. `fieldName` is what the provider calls their
// api key.
exports.resolveSettings = function (settings, fieldName) {
  if (!isString(settings) && !isObject(settings))
      throw new Error('Could not resolve settings.');
  if (!fieldName)
      throw new Error('You must provide an api key field name.');

  // Allow for settings to just be an API key, for example:
  //
  //     { 'Google Analytics : 'UA-XXXXXXX-X' }
  if (isString(settings)) {
      var apiKey = settings;
      settings = {};
      settings[fieldName] = apiKey;
  }

  return settings;
};

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

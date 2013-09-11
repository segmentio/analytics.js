
var each = require('each')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `LiveChat` integration.
 *
 * http://www.livechatinc.com/api/javascript-api
 */

var LiveChat = module.exports = integration('LiveChat');


/**
 * Required key.
 */

LiveChat.prototype.key = 'license';


/**
 * Default options.
 */

LiveChat.prototype.defaults = {
  // your livechat license (required)
  license: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

LiveChat.prototype.initialize = function (options, ready) {
  window.__lc = { license : options.license };
  load('//cdn.livechatinc.com/tracking.js', ready);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

LiveChat.prototype.identify = function (id, traits, options) {
  if (id) traits['User ID'] = id; // the way livechat key's their id
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

var callback = require('callback');
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `USERcycle` integration.
 */

var USERcycle = module.exports = integration('USERcycle')
  .option('key', '');


/**
 * Initialize.
 *
 * http://docs.usercycle.com/javascript_api
 */

USERcycle.prototype.initialize = function () {
  window._uc || (window._uc = []);
  push('_key', this.options.key);
  callback.async(this.ready);
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

USERcycle.prototype.load = function (callback) {
  load('//api.usercycle.com/javascripts/track.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

USERcycle.prototype.identify = function (id, traits, options) {
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

USERcycle.prototype.track = function (event, properties, options) {
  push('action', event, properties);
};


/**
 * Helper to push onto the USERcycle queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._uc.push(args);
}
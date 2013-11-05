
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_uc');


/**
 * Expose `Usercycle`.
 */

var Usercycle = module.exports = integration('USERcycle')
  .assumesPageview()
  .readyOnInitialize()
  .global('_uc')
  .option('key', '');


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
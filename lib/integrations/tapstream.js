
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script');
var slug = require('slug');


/**
 * Expose `Tapstream`.
 */

var Tapstream = module.exports = integration('Tapstream')
  .option('accountName', '')
  .option('trackAllPages', true)
  .option('trackNamedPages', true);


/**
 * Initialize.
 */

Tapstream.prototype.initialize = function () {
  window._tsq = window._tsq || [];
  push('setAccountName', this.options.accountName);
  callback.async(this.ready);
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

Tapstream.prototype.pageview = function (name, properties, options) {
  var named = this.options.trackNamePages;
  var all = this.options.trackAllPages;
  if (named && name) this.track('Viewed ' + name + ' Page', properties);
  if (all) this.track('Loaded a Page', properties);
};


/**
 * Helper to push onto the Tapstream queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._tsq.push(args);
}
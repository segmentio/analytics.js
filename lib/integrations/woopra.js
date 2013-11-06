
var each = require('each');
var extend = require('extend');
var integration = require('integration');
var isEmail = require('is-email');
var load = require('load-script');
var type = require('type');


/**
 * Expose `Woopra`.
 */

var Woopra = module.exports = integration('Woopra')
  .global('woopra')
  .assumesPageview()
  .readyOnLoad()
  .option('domain', '');


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
  traits = traits || {};
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
  properties = properties || {};
  window.woopra.track('pv', {
    url: properties.url,
    title: name || properties.title
  });
};
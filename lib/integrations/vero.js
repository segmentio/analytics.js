
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Vero` integration.
 *
 * https://github.com/getvero/vero-api/blob/master/sections/js.md
 */

var Vero = module.exports = integration('Vero');


/**
 * Required key.
 */

Vero.prototype.key = 'apiKey';


/**
 * Default options.
 */

Vero.prototype.defaults = {
  // your vero api key (required)
  apiKey: ''
};


/**
 * Initialize.
 *
 * https://github.com/getvero/vero-api/blob/master/sections/js.md#setup
 *
 * @param {Object} options
 * @param {Function} ready
 */

Vero.prototype.initialize = function (options, ready) {
  window._veroq || (window._veroq = []);
  window._veroq.push(['init', { api_key: options.apiKey }]);
  ready();
  load('//d3qxef4rp70elm.cloudfront.net/m.js');
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
  window._veroq.push(['user', traits]);
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
  window._veroq.push(['track', event, properties]);
};
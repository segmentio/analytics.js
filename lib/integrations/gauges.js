
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Gauges` integration.
 */

var Gauges = module.exports = integration('Gauges');


/**
 * Required key.
 */

Gauges.prototype.key = 'siteId';


/**
 * Default options.
 */

Gauges.prototype.defaults = {
  // your gauges site id (required)
  siteId: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Gauges.prototype.initialize = function (options, ready) {
  window._gauges = window._gauges || [];
  ready();

  // add required `id` and `data-site-id` to the script element
  var script = load('//secure.gaug.es/track.js');
  script.id = 'gauges-tracker';
  script.setAttribute('data-site-id', options.siteId);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Gauges.prototype.pageview = function (url) {
  window._gauges.push(['track']);
};

var callback = require('callback')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `HubSpot` integration.
 */

var HubSpot = module.exports = integration('HubSpot');


/**
 * Required key.
 */

HubSpot.prototype.key = 'portalId';


/**
 * Default options.
 */

HubSpot.prototype.defaults = {
  // your hubspot portal id (required)
  portalId: null
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

HubSpot.prototype.initialize = function (options, ready) {
  // hubspot doesn't let multiple scripts get appended
  if (!document.getElementById('hs-analytics')) {
    window._hsq = window._hsq || [];
    var cache = Math.ceil(new Date() / 300000) * 300000;
    var script = load('https://js.hubspot.com/analytics/' + cache + '/' + options.portalId + '.js');
    script.id = 'hs-analytics';
  }
  callback.async(ready);
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
  window._hsq.push(['identify', traits]);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

HubSpot.prototype.track = function (event, properties, options) {
  window._hsq.push(['trackEvent', event, properties]);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

HubSpot.prototype.pageview = function (url) {
  window._hsq.push(['_trackPageview']);
};

var callback = require('callback');
var integration = require('integration');
var load = require('load-script-once');


/**
 * Expose `HubSpot`.
 */

var HubSpot = module.exports = integration('HubSpot')
  .assumesPageview()
  .readyOnInitialize()
  .option('portalId', null);


/**
 * Exists?
 */

HubSpot.prototype.exists = function () {
  return !! window._hsq;
};


/**
 * Initialize.
 */

HubSpot.prototype.initialize = function () {
  window._hsq = [];
  this.load();
};


/**
 * Load the HubSpot library.
 *
 * @param {Function} callback
 */

HubSpot.prototype.load = function (callback) {
  if (document.getElementById('hs-analytics')) return;
  var id = this.options.portalId;
  var cache = Math.ceil(new Date() / 300000) * 300000;
  var url = 'https://js.hubspot.com/analytics/' + cache + '/' + id + '.js';
  var script = load(url, callback);
  script.id = 'hs-analytics';
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
  push('identify', traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

HubSpot.prototype.track = function (event, properties, options) {
  push('trackEvent', event, properties);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

HubSpot.prototype.page = function (name, properties, options) {
  push('_trackPageview');
};


/**
 * Helper to push onto the HubSpot queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._hsq.push(args);
}
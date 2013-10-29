
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Gauges`.
 */

var Gauges = module.exports = integration('Gauges')
  .assumesPageview()
  .readyOnInitialize()
  .option('siteId', '');


/**
 * Exists?
 */

Gauges.prototype.exists = function () {
  return !! window._gauges;
};


/**
 * Initialize Gauges.
 *
 * http://get.gaug.es/documentation/tracking/
 */

Gauges.prototype.initialize = function () {
  window._gauges = [];
  this.load();
};


/**
 * Load the Gauges library.
 *
 * @param {Function} callback
 */

Gauges.prototype.load = function (callback) {
  var id = this.options.siteId;
  var script = load('//secure.gaug.es/track.js', callback);
  script.id = 'gauges-tracker';
  script.setAttribute('data-site-id', id);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Gauges.prototype.page = function (name, properties, options) {
  window._gauges.push(['track']);
};
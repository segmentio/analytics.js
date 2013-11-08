
var alias = require('alias')
  , integration = require('../integration')
  , load = require('load-script');

/**
 * Expose `Drip` integration.
 */

var Drip = module.exports = integration('Drip');

/**
 * Required key.
 */

Drip.prototype.key = 'account';

/**
 * Default options.
 */

Drip.prototype.defaults = {
  account: ''
};

/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Drip.prototype.initialize = function (options, ready) {
  window._dcq || (window._dcq = []);
  window._dcs || (window._dcs = {});
  window._dcs.account = options.account;
  load('//tag.getdrip.com/' + options.account + '.js', ready);
};

/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Drip.prototype.track = function (event, properties, options) {
  properties || (properties = {});
  convertRevenueToCents(properties);
  alias(properties, { revenue: 'value' });
  properties.action = event;
  push('track', properties);
};

/**
 * Helper to convert revenue into a cents (integer).
 *
 * @param {Object} properties
 */

function convertRevenueToCents (properties) {
  if (properties.revenue) {
    properties.revenue = parseInt(properties.revenue * 100, 10);
  }
}

/**
 * Helper to push onto the Drip queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._dcq.push(args);
}

/**
 * Analytics.js
 *
 * (C) 2015 Segment.io Inc.
 */

var Analytics = require('segmentio/analytics.js-core');
var Integrations = require('./integrations');
var each = require('each');

/**
 * Expose the `analytics` singleton.
 */
// XXX: Analytics is already instantiated in analytics.js-core, requires attention
var analytics = module.exports = exports = Analytics;

/**
 * Expose require.
 */

analytics.require = require;

/**
 * Expose `VERSION`.
 */

exports.VERSION = require('../bower.json').version;

/**
 * Add integrations.
 */

each(Integrations, function(name, Integration) {
  analytics.use(Integration);
});

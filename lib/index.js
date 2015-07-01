
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

var analytics = module.exports = exports = new Analytics();

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

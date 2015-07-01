
/**
 * Analytics.js
 *
 * (C) 2015 Segment.io Inc.
 */

var Analytics = require('segmentio/analytics.js-core');
var Integrations = require('./integrations');
var each = require('each');

/**
 * Initialize the `analytics` singleton.
 */

var analytics = new Analytics();

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

/**
 * Expose `analytics`.
 */

module.exports = analytics;

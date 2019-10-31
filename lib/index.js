/**
 * Analytics.js
 *
 * (C) 2017 Segment Inc.
 */

var analytics = require('@dreamdata/analytics.js-core');
var Integrations = require('./integrations');

/**
 * Expose the `analytics` singleton.
 */

module.exports = exports = analytics;

/**
 * Expose require.
 */

analytics.require = require;

/**
 * Expose `VERSION`.
 */

exports.VERSION = require('../package.json').version;

/**
 * Add integrations.
 */
for (Integration in Integrations) {
    analytics.use(Integrations[Integration]);
}

/**
 * Analytics.js
 *
 * (C) 2017 Segment Inc.
 */

var analytics = require("@segment/analytics.js-core");
var dreamdataio = require("@dreamdata/analytics.js-integration-dreamdataio");

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

exports.VERSION = require("../package.json").version;

/**
 * Add integrations.
 */

analytics.use(dreamdataio);

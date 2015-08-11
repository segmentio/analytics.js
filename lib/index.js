
/**
 * Analytics.js
 *
 * (C) 2015 Segment.io Inc.
 */

var analytics = require('segmentio/analytics.js-core');
var Integrations = require('./integrations');
var each = require('each');

module.exports = exports = analytics;

/**
 * Add integrations.
 */

each(Integrations, function(name, Integration) {
  analytics.use(Integration);
});

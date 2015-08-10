
/**
 * Analytics.js
 *
 * (C) 2015 Segment.io Inc.
 */

var Analytics = require('segmentio/analytics.js-core');
var Integrations = require('./integrations');
var each = require('each');

/**
 * Add integrations.
 */

each(Integrations, function(name, Integration) {
  analytics.use(Integration);
});

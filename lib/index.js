/**
 * Analytics.js
 *
 * (C) 2013 Segment.io Inc.
 */

var Analytics = require('./analytics');
var createIntegration = require('integration');
var each = require('each');
var Integrations = require('integrations');


/**
 * Expose the `analytics` singleton.
 */

var analytics = module.exports = exports = new Analytics();


/**
 * Expose `VERSION`.
 */

exports.VERSION = '1.1.3';


/**
 * Add integrations.
 */

each(Integrations, function (name, Integration) {
  analytics.use(Integration);
});
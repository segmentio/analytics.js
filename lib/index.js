'use strict';

var analytics = require('@astronomerio/analytics.js-core');
var Integrations = require('./integrations');

/**
 * Expose the `analytics` singleton.
 */

module.exports = exports = analytics;

/**
 * Expose `VERSION`.
 */

exports.VERSION = require('../package.json').version;

/**
 * Add integrations.
 */

Object.keys(Integrations).forEach(function(name) {
  analytics.use(Integrations[name]);
});


/**
 * Analytics.js
 *
 * (C) 2013 Segment.io Inc.
 */

var _analytics = window.analytics;
var Integrations = require('../integrations.js');
var Analytics = require('./analytics');
var each = require('each');


/**
 * Expose the `analytics` singleton.
 */

var analytics = module.exports = exports = new Analytics();

/**
 * Expose require
 */

analytics.require = require;

/**
 * Expose `VERSION`.
 */

exports.VERSION = require('../bower.json').version;

/**
 * Add integrations.
 */

each(Integrations, function (name, Integration) {
  analytics.use(Integration);
});

/**
 * Run through all items in the queue
 */

if(_analytics instanceof Array) {
    while (_analytics.length > 0) {
        var item = _analytics.shift();
        var method = item.shift();
        if (analytics[method]) {
            analytics[method].apply(analytics, item);
        }
    }
}

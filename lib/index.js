
/**
 * Analytics.js
 *
 * (C) 2015 Segment.io Inc.
 */

var analytics = require('MadKudu/analytics.js-core@2.11.4');
var Integrations = {};
var each = require('each');
var predictive = require('./predictive');

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

exports.VERSION = require('../bower.json').version;

/**
 * Add integrations.
 */

each(Integrations, function(name, Integration) {
  analytics.use(Integration);
});


// MadKudu specific part

var mdkd = window.madkudu || [];


/**
 * Snippet version.
 */

var snippet = mdkd && mdkd.SNIPPET_VERSION
  ? parseFloat(mdkd.SNIPPET_VERSION, 10)
  : 0;

/**
 * Initialize.
 */

analytics.initialize({});

/**
 * Before swapping the global, replay an existing global `madkudu` queue.
 */

while (mdkd && mdkd.length > 0) {
  var args = mdkd.shift();
  var method = args.shift();
  if (analytics[method]) analytics[method].apply(analytics, args);
}

 // Add the madkudu predictions function

analytics.user.predictions = function() {
  var traits = this.traits();
  return predictive(traits);
};

/**
 * Finally, replace the global queue with the real `madkudu` singleton.
 */

window.madkudu = analytics;



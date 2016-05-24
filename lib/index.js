
/**
 * madkudu.js
 *
 * (C) 2015 Segment.io Inc.
 */

var madkudu = require('MadKudu/analytics.js-core@mk2.12.2');
var Integrations = {};
var each = require('each');

/**
 * Expose the `madkudu` singleton.
 */

module.exports = exports = madkudu;

/**
 * Expose require.
 */

madkudu.require = require;

/**
 * Expose `VERSION`.
 */

exports.VERSION = require('../bower.json').version;

/**
 * Add integrations.
 */

each(Integrations, function(name, Integration) {
  madkudu.use(Integration);
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

madkudu.initialize({});

/**
 * Before swapping the global, replay an existing global `madkudu` queue.
 */

while (mdkd && mdkd.length > 0) {
  var args = mdkd.shift();
  var method = args.shift();
  if (madkudu[method]) madkudu[method].apply(madkudu, args);
}

 // Add the madkudu predictions function

madkudu.user.predictions = function() {
  var traits = this.traits();
  return predictive(traits);
};

/**
 * Finally, replace the global queue with the real `madkudu` singleton.
 */

window.madkudu = madkudu;



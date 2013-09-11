
var bind = require('bind')
  , each = require('each')
  , integration = require('../integration')
  , load = require('load-script')
  , tick = require('next-tick');


/**
 * Expose `Optimizely` integration.
 *
 * https://www.optimizely.com/docs/api
 */

var Optimizely = module.exports = integration('Optimizely');


/**
 * Default options.
 */

Optimizely.prototype.defaults = {
  // whether to replay variations into other enabled integrations as traits
  variations: true
};


/**
 * Initialize.
 *
 * https://www.optimizely.com/docs/api#function-calls
 *
 * @param {Object} options
 * @param {Function} ready
 */

Optimizely.prototype.initialize = function (options, ready) {
  window.optimizely = window.optimizely || [];
  ready();
  if (options.variations) tick(bind(this, this.replay));
};


/**
 * Track.
 *
 * https://www.optimizely.com/docs/api#track-event
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Optimizely.prototype.track = function (event, properties, options) {
  // optimizely takes revenue as cents, not dollars
  if (properties.revenue) properties.revenue = properties.revenue * 100;
  window.optimizely.push(['trackEvent', event, properties]);
};


/**
 * Replay experiment data as traits to other enabled providers.
 *
 * https://www.optimizely.com/docs/api#data-object
 */

Optimizely.prototype.replay = function () {
  var data = window.optimizely.data;
  if (!data) return;

  var experiments = data.experiments;
  var map = data.state.variationNamesMap;
  var traits = {};

  each(map, function (experimentId, variation) {
    var experiment = experiments[experimentId].name;
    traits['Experiment: ' + experiment] = variation;
  });

  this.analytics.identify(traits);
};
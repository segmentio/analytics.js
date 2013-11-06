
var bind = require('bind');
var callback = require('callback');
var each = require('each');
var integration = require('integration');
var push = require('global-queue')('optimizely');
var tick = require('next-tick');


/**
 * Expose `Optimizely`.
 */

var Optimizely = module.exports = integration('Optimizely')
  .readyOnInitialize()
  .option('variations', true);


/**
 * Initialize.
 *
 * https://www.optimizely.com/docs/api#function-calls
 */

Optimizely.prototype.initialize = function () {
  if (this.options.variations) tick(this.replay);
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
  properties || (properties = {});
  if (properties.revenue) properties.revenue = properties.revenue * 100;
  push('trackEvent', event, properties);
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
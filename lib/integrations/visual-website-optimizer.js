
var callback = require('callback');
var each = require('each');
var inherit = require('inherit');
var integration = require('integration');
var tick = require('next-tick');


/**
 * Expose `VWO`.
 */

var VWO = module.exports = integration('Visual Website Optimizer')
  .readyOnInitialize()
  .option('replay', true);


/**
 * Initialize.
 *
 * http://v2.visualwebsiteoptimizer.com/tools/get_tracking_code.php
 */

VWO.prototype.initialize = function () {
  if (this.options.replay) this.replay();
};


/**
 * Replay the experiments the user has seen as traits to all other integrations.
 * Wait for the next tick to replay so that the `analytics` object and all of
 * the integrations are fully initialized.
 */

VWO.prototype.replay = function () {
  var analytics = this.analytics;
  tick(function () {
    experiments(function (err, traits) {
      if (traits) analytics.identify(traits);
    });
  });
};


/**
 * Get dictionary of experiment keys and variations.
 *
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param {Function} callback
 * @return {Object}
 */

function experiments (callback) {
  enqueue(function () {
    var data = {};
    var ids = window._vwo_exp_ids;
    if (!ids) return callback();
    each(ids, function (id) {
      var name = variation(id);
      if (name) data['Experiment: ' + id] = name;
    });
    callback(null, data);
  });
}


/**
 * Add a `fn` to the VWO queue, creating one if it doesn't exist.
 *
 * @param {Function} fn
 */

function enqueue (fn) {
  window._vis_opt_queue = window._vis_opt_queue || [];
  window._vis_opt_queue.push(fn);
}


/**
 * Get the chosen variation's name from an experiment `id`.
 *
 * http://visualwebsiteoptimizer.com/knowledge/integration-of-vwo-with-kissmetrics/
 *
 * @param {String} id
 * @return {String}
 */

function variation (id) {
  var experiments = window._vwo_exp;
  if (!experiments) return null;
  var experiment = experiments[id];
  var variationId = experiment.combination_chosen;
  return variationId ? experiment.comb_n[variationId] : null;
}
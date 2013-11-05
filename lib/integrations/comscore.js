
var integration = require('integration');
var load = require('load-script');


/**
 * Expose `Comscore`.
 */

var Comscore = module.exports = integration('comScore')
  .assumesPageview()
  .readyOnLoad()
  .global('_comscore')
  .global('COMSCORE')
  .option('c1', '2')
  .option('c2', '');


/**
 * Initialize.
 *
 * @param {Object} page
 */

Comscore.prototype.initialize = function (page) {
  window._comscore = [this.options];
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Comscore.prototype.load = function (callback) {
  load({
    http: 'http://b.scorecardresearch.com/beacon.js',
    https: 'https://sb.scorecardresearch.com/beacon.js'
  }, callback);
};
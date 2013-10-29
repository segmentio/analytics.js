
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `Comscore`.
 */

var Comscore = module.exports = integration('Comscore')
  .assumesPageview()
  .readyOnLoad()
  .option('c1', '2')
  .option('c2', '');


/**
 * Exists?
 */

Comscore.prototype.exists = function () {
  return !! window._comscore;
};


/**
 * Initialize.
 */

Comscore.prototype.initialize = function () {
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
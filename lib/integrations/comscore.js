
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `comScore`.
 */

var comScore = module.exports = integration('comScore')
  .option('c1', '2')
  .option('c2', '');


/**
 * Initialize.
 */

comScore.prototype.initialize = function () {
  window._comscore = window._comscore || [];
  window._comscore.push(this.options);
  this.load(this.ready);
};


/**
 * Load the comScore library.
 *
 * @param {Function} callback
 */

comScore.prototype.load = function (callback) {
  load({
    http: 'http://b.scorecardresearch.com/beacon.js',
    https: 'https://sb.scorecardresearch.com/beacon.js'
  }, callback);
};

var integration = require('integration');
var load = require('load-script');


/**
 * Expose `HitTail`.
 */

var HitTail = module.exports = integration('HitTail')
  .assumesPageview()
  .readyOnLoad()
  .global('htk')
  .option('siteId', '');


/**
 * Initialize.
 */

HitTail.prototype.initialize = function () {
  this.load();
};


/**
 * Load the HitTail library.
 *
 * @param {Function} callback
 */

HitTail.prototype.load = function (callback) {
  var id = this.options.siteId;
  load('//' + id + '.hittail.com/mlt.js', callback);
};
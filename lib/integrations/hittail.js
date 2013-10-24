
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `HitTail`.
 */

var HitTail = module.exports = integration('HitTail')
  .assumesPageview()
  .option('siteId', '');


/**
 * Initialize.
 */

HitTail.prototype.initialize = function () {
  this.load(this.ready);
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
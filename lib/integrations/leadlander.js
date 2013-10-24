
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `LeadLander`.
 */

var LeadLander = module.exports = integration('LeadLander')
  .option('accountId', null);


/**
 * Initialize.
 */

LeadLander.prototype.initialize = function () {
  window.llactid = this.options.accountId;
  this.load(this.ready);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

LeadLander.prototype.load = function (callback) {
  load('http://t6.trackalyzer.com/trackalyze-nodoc.js', callback);
};
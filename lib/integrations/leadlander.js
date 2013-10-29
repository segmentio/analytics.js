
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `LeadLander`.
 */

var LeadLander = module.exports = integration('LeadLander')
  .assumesPageview()
  .readyOnLoad()
  .option('accountId', null);


/**
 * Exists?
 */

LeadLander.prototype.exists = function () {
  return !! window.llactid;
};


/**
 * Initialize.
 */

LeadLander.prototype.initialize = function () {
  window.llactid = this.options.accountId;
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

LeadLander.prototype.load = function (callback) {
  load('http://t6.trackalyzer.com/trackalyze-nodoc.js', callback);
};
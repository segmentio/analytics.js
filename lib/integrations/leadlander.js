
var integration = require('integration');
var load = require('load-script');


/**
 * Expose `LeadLander`.
 */

var LeadLander = module.exports = integration('LeadLander')
  .assumesPageview()
  .readyOnLoad()
  .global('llactid')
  .global('trackalyzer')
  .option('accountId', null);


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
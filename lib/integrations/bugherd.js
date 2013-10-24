
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `BugHerd`.
 */

var BugHerd = module.exports = integration('BugHerd')
  .option('apiKey', '')
  .option('showFeedbackTab', true);


/**
 * Initialize.
 *
 * http://support.bugherd.com/home
 */

BugHerd.prototype.initialize = function () {
  var options = this.options;
  var feedback = options.showFeedbackTab;
  window.BugHerdConfig = { feedback: { hide: !feedback }};
  this.load(this.ready);
};


/**
 * Load the BugHerd library.
 *
 * @param {Function} callback
 */

BugHerd.prototype.load = function (callback) {
  var key = this.options.apiKey;
  load('//www.bugherd.com/sidebarv2.js?apikey=' + key, callback);
};

var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `BugHerd` integration.
 *
 * http://support.bugherd.com/home
 */

var BugHerd = module.exports = integration('BugHerd');


/**
 * Default options.
 */

BugHerd.prototype.defaults = {
  // your bugherd api key (required)
  apiKey: '',
  // whether to show the feedback tab on page load
  showFeedbackTab: true
};


/**
 * Initialize.
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
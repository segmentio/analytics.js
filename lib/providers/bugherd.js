
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `BugHerd` integration.
 *
 * http://support.bugherd.com/home
 */

var BugHerd = module.exports = integration('BugHerd');


/**
 * Required key.
 */

BugHerd.prototype.key = 'apiKey';


/**
 * Default options.
 */

BugHerd.prototype.defaults = {
  // your amplitude api key (required)
  apiKey: '',
  // whether to show or hide the feedback tab to start
  // http://support.bugherd.com/entries/21497629-Create-your-own-Send-Feedback-tab
  showFeedbackTab: true
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

BugHerd.prototype.initialize = function (options, ready) {
  window.BugHerdConfig = {};
  if (!options.showFeedbackTab) window.BugHerdConfig.feedback = { hide: true };
  load('//www.bugherd.com/sidebarv2.js?apikey=' + options.apiKey, ready);
};
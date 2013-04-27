// http://support.bugherd.com/home

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'BugHerd',

  key : 'apiKey',

  defaults : {
    apiKey : null,
    // Optionally hide the feedback tab if you want to build your own.
    // http://support.bugherd.com/entries/21497629-Create-your-own-Send-Feedback-tab
    showFeedbackTab : true
  },

  initialize : function (options, ready) {
    if (!options.showFeedbackTab) {
        window.BugHerdConfig = { "feedback" : { "hide" : true } };
    }
    load('//www.bugherd.com/sidebarv2.js?apikey=' + options.apiKey, ready);
  }

});
// BugHerd
// -------
// [Documentation](http://support.bugherd.com/home).

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'BugHerd',

  key : 'apiKey',

  options : {
    apiKey : null
  },

  initialize : function (options, ready) {
    load('//www.bugherd.com/sidebarv2.js?apikey=' + options.apiKey, ready);
  }

});
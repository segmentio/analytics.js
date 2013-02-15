// USERcycle
// -----------
// [Documentation](http://docs.usercycle.com/javascript_api).

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'key',

  options : {
    key : null
  },


  initialize : function (options, ready) {
    window._uc = window._uc || [];
    window._uc.push(['_key', options.key]);
    load('//api.usercycle.com/javascripts/track.js');

    // USERcycle makes a queue, so it's ready immediately.
    ready();
  },


  identify : function (userId, traits) {
    if (userId) window._uc.push(['uid', userId, traits]);
  },


  track : function (event, properties) {
    window._uc.push(['action', event, properties]);
  }

});
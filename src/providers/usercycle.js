// http://docs.usercycle.com/javascript_api

var Provider = require('../provider')
  , load     = require('load-script')
  , user     = require('../user');


module.exports = Provider.extend({

  name : 'USERcycle',

  key : 'key',

  defaults : {
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
    if (userId) window._uc.push(['uid', userId]);

    // USERcycle has a special "hidden" event that is used just for retention measurement.
    // Lukas suggested on 6/4/2013 that we send traits on that event, since they use the
    // the latest value of every event property as a "trait"
    window._uc.push(['action', 'came_back', traits]);
  },

  track : function (event, properties) {
    window._uc.push(['action', event, properties]);
  }

});
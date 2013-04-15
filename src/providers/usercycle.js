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
  },

  track : function (event, properties) {
    // Usercycle seems to use traits instead of properties.
    var traits = user.traits();
    window._uc.push(['action', event, traits]);
  }

});
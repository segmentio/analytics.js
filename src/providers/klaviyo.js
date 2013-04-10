// https://www.klaviyo.com/docs

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Klaviyo',

  key : 'apiKey',

  defaults : {
    apiKey : null
  },

  initialize : function (options, ready) {
    window._learnq = window._learnq || [];
    window._learnq.push(['account', options.apiKey]);
    load('//a.klaviyo.com/media/js/learnmarklet.js');

    // Klaviyo creats a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    if (!userId && !traits) return;

    // Klaviyo takes the user ID on the traits object itself.
    traits || (traits = {});
    if (userId) traits.$id = userId;

    window._learnq.push(['identify', traits]);
  },

  track : function (event, properties) {
    window._learnq.push(['track', event, properties]);
  }

});
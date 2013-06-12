// https://github.com/getvero/vero-api/blob/master/sections/js.md

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Vero',

  key : 'apiKey',

  defaults : {
    apiKey : null
  },

  initialize : function (options, ready) {
    window._veroq = window._veroq || [];
    window._veroq.push(['init', { api_key: options.apiKey }]);
    load('//d3qxef4rp70elm.cloudfront.net/m.js');

    // Vero creates a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    // Don't do anything if we just have traits, because Vero
    // requires a `userId`.
    if (!userId || !traits.email) return;

    // Vero takes the `userId` as part of the traits object.
    traits.id = userId;

    window._veroq.push(['user', traits]);
  },

  track : function (event, properties) {
    window._veroq.push(['track', event, properties]);
  }

});
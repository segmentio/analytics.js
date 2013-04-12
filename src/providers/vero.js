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
    load('//www.getvero.com/assets/m.js');

    // Vero creates a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    // Don't do anything if we just have traits, because Vero
    // requires a `userId`.
    if (!userId) return;

    traits || (traits = {});

    // Vero takes the `userId` as part of the traits object.
    traits.id = userId;

    // If there wasn't already an email and the userId is one, use it.
    if (!traits.email && isEmail(userId)) traits.email = userId;

    // Vero *requires* an email and an id
    if (!traits.id || !traits.email) return;

    window._veroq.push(['user', traits]);
  },

  track : function (event, properties) {
    window._veroq.push(['track', event, properties]);
  }

});
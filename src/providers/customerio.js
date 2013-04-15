// http://customer.io/docs/api/javascript.html

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Customer.io',

  key : 'siteId',

  defaults : {
    siteId : null
  },

  initialize : function (options, ready) {
    var _cio = window._cio = window._cio || [];
    (function() {
      var a,b,c;
      a = function (f) {
        return function () {
          _cio.push([f].concat(Array.prototype.slice.call(arguments,0)));
        };
      };
      b = ['identify', 'track'];
      for (c = 0; c < b.length; c++) {
        _cio[b[c]] = a(b[c]);
      }
    })();

    // Load the Customer.io script and add the required `id` and `data-site-id`.
    var script = load('https://assets.customer.io/assets/track.js');
    script.id = 'cio-tracker';
    script.setAttribute('data-site-id', options.siteId);

    // Since Customer.io creates their required methods in their snippet, we
    // don't need to wait to be ready.
    ready();
  },

  identify : function (userId, traits) {
    // Don't do anything if we just have traits, because Customer.io
    // requires a `userId`.
    if (!userId) return;

    traits || (traits = {});

    // Customer.io takes the `userId` as part of the traits object.
    traits.id = userId;

    // If there wasn't already an email and the userId is one, use it.
    if (!traits.email && isEmail(userId)) traits.email = userId;

    // Swap the `created` trait to the `created_at` that Customer.io needs
    // and convert it from milliseconds to seconds.
    if (traits.created) {
      traits.created_at = Math.floor(traits.created/1000);
      delete traits.created;
    }

    window._cio.identify(traits);
  },

  track : function (event, properties) {
    window._cio.track(event, properties);
  }

});
// https://www.userfox.com/docs/

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  name : 'userfox',

  key : 'clientId',

  defaults : {
    // userfox's required key.
    clientId : null
  },

  initialize : function (options, ready) {
    window._ufq = window._ufq || [];
    load('//d2y71mjhnajxcg.cloudfront.net/js/userfox-stable.js');

    // userfox creates its own queue, so we're ready right away
    ready();
  },

  identify : function (userId, traits, context) {
    // userfox requires an email.
    var email;
    if (userId && isEmail(userId)) email = userId;
    if (traits && isEmail(traits.email)) email = traits.email;
    if (!email) return;

    // Initialize the library with the email now that we have it.
    window._ufq.push(['init', {
      clientId : this.options.clientId,
      email    : email
    }]);

    // Track the signup date if we have it.
    if (traits && traits.created) {
      window._ufq.push(['track', { signup_date: traits.created.getTime()+'' }]);
    }
  }

});

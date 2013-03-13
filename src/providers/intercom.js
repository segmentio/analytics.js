// Intercom
// --------
// [Documentation](http://docs.intercom.io/).

var Provider = require('../provider')
  , load     = require('load-script')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  // We need to store this state to know whether to call `boot` or `update`.
  booted : false,

  key : 'appId',

  options : {
    // Intercom's required key.
    appId : null,
    // An optional setting to display the Intercom inbox widget.
    activator : null,
    // Whether to show the count of messages for the inbox widget.
    counter : true
  },

  initialize : function (options, ready) {
    load('https://api.intercom.io/api/js/library.js', ready);
  },

  identify : function (userId, traits) {
    // Intercom requires a `userId` to associate data to a user.
    if (!userId) return;

    // Intercom takes extra traits as `custom_data`, but needs some of our
    // "reserved" traits as top-level properties, so we'll pull them out next.
    var settings = {
      app_id      : this.options.appId,
      user_hash   : this.options.userHash,
      user_id     : userId,
      custom_data : traits || {}
    };

    // They need `created_at` as a Unix timestamp (seconds).
    if (traits && traits.created) {
      settings.created_at = Math.floor(traits.created/1000);
      delete traits.created;
    }

    // Pull out an email field. Falling back to the `userId` if possible.
    if (traits && traits.email) {
      settings.email = traits.email;
      delete traits.email;
    } else if (isEmail(userId)) {
      settings.email = userId;
    }

    // Pull out a name field, or combine one from `firstName` and `lastName`.
    if (traits && traits.name) {
      settings.name = traits.name;
      delete traits.name;
    } else if (traits && traits.firstName && traits.lastName) {
      settings.name = traits.firstName + ' ' + traits.lastName;
    }

    // Pull out a company field.
    if (traits && traits.company) {
      settings.company = traits.company;
      delete traits.company;
    }

    // Optionally add the inbox widget.
    if (this.options.activator) {
      settings.widget = {
        activator   : this.options.activator,
        use_counter : this.options.counter
      };
    }

    // If this is the first time we've identified, `boot` instead of `update`.
    var method = this.booted ? 'update' : 'boot';
    window.Intercom(method, settings);

    this.booted = true;
  }

});

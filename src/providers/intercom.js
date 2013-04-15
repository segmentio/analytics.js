// http://docs.intercom.io/
// http://docs.intercom.io/#IntercomJS

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  name : 'Intercom',

  // Whether Intercom has already been booted or not. Intercom becomes booted
  // after Intercom('boot', ...) has been called on the first identify.
  booted : false,

  key : 'appId',

  defaults : {
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

  identify : function (userId, traits, context) {
    // Intercom requires a `userId` to associate data to a user.
    if (!userId) return;

    // Don't do anything if we just have traits.
    if (!this.booted && !userId) return;

    // Pass traits directly in to Intercom's `custom_data`.
    var settings = extend({
      custom_data : traits || {}
    }, (context && context.intercom) ? context.intercom : {});

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

    // Pull out a company field, with it's own optional `created` date.
    if (traits && traits.company) {
      if (traits.company.created) {
        traits.company.created_at = Math.floor(traits.company.created/1000);
        delete traits.company.created;
      }
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

    // If this is the first time we've identified, `boot` instead of `update`
    // and add our one-time boot settings.
    if (this.booted) {
      window.Intercom('update', settings);
    } else {
      extend(settings, {
        app_id    : this.options.appId,
        user_id   : userId
      });

      if (this.options.userHash)
        settings.user_hash = this.options.userHash;

      window.Intercom('boot', settings);
    }

    // Set the booted state, so that we know to call 'update' next time.
    this.booted = true;
  }

});

// Intercom
// --------
// [Documentation](http://docs.intercom.io/).

var Provider = require('../provider')
  , load     = require('load-script')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  // Whether Intercom has already been booted or not. Intercom becomes booted
  // after Intercom('boot', ...) has been called on the first identify.
  booted : false,

  key : 'appId',

  options : {
    appId : null,

    // An optional setting to display the Intercom inbox widget.
    activator : null,
    // Whether to show the count of messages for the inbox widget.
    counter : true
  },


  // Intercom used to require intercomSettings to be available before you 
  // could load the library, but the new API (2013/3/13) solves this problem.
  initialize : function (options, ready) {
    // Intercom doesn't create a queue so we have to call ready once it's loaded.
    load('https://api.intercom.io/api/js/library.js', ready);
  },


  identify : function (userId, traits) {

    console.log(userId, traits);

    // Don't do anything if we just have traits.
    if (!this.booted && !userId) return;

    // Pass traits directly in to Intercom's `custom_data`.
    var settings = {
      app_id      : this.options.appId,
      user_id     : userId,
      user_hash   : this.options.userHash,
      custom_data : traits || {}
    };

    // Augment `intercomSettings` with some of the special traits. The `created`
    // property must also be converted to `created_at` in seconds.
    if (traits) {
      settings.email = traits.email;
      settings.name = traits.name;
      settings.company = traits.company;
      if (traits.created) settings.created_at = Math.floor(traits.created/1000);
    }

    // If they didn't pass an email, check to see if the `userId` qualifies.
    if (isEmail(userId) && (traits && !traits.email)) settings.email = userId;

    // Optionally add the widget.
    if (this.options.activator) {
      settings.widget = {
        activator   : this.options.activator,
        use_counter : this.options.counter
      };
    }


    // The first time identify is called, we need to 'boot'.
    // Any time after that we need to call 'update' instead.
    // See http://docs.intercom.io/#IntercomJS
    if (!this.booted)
      window.Intercom('boot', settings);
    else
      window.Intercom('update', settings);

    // Set the booted state, so that we know to call 'update' next time.
    this.booted = true;
  }

});

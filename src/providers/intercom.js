// Intercom
// --------
// [Documentation](http://docs.intercom.io/).

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  // Whether Intercom has already been initialized or not. This is because
  // since we initialize Intercom on `identify`, people can make multiple
  // `identify` calls and we don't want that breaking anything.
  initialized : false,

  key : 'appId',

  options : {
    appId : null,

    // An optional setting to display the Intercom inbox widget.
    activator : null
  },


  // Intercom identifies when the script is loaded, so instead of initializing
  // in `initialize` we initialize in `identify`.
  initialize : function (options, ready) {
    // Intercom is weird, so we call ready right away so that it doesn't block
    // everything from loading.
    ready();
  },


  identify : function (userId, traits) {
    // If we've already been initialized once, don't do it again since we
    // load the script when this happens. Intercom can only handle one
    // identify call.
    if (this.initialized) return;

    // Don't do anything if we just have traits.
    if (!userId) return;

    // Pass traits directly in to Intercom's `custom_data`.
    var settings = window.intercomSettings = {
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
      settings.created_at = Math.floor(traits.created/1000);
    }

    // If they didn't pass an email, check to see if the `userId` qualifies.
    if (isEmail(userId) && (traits && !traits.email)) {
      settings.email = userId;
    }

    // Optionally add the widget.
    if (this.options.activator) {
      settings.widget = {
          activator : this.options.activator
      };
    }

    load('https://api.intercom.io/api/js/library.js');

    // Set the initialized state, so that we don't initialize again.
    this.initialized = true;
  }

});
// Intercom
// --------
// [Documentation](http://docs.intercom.io/).

var extend  = require('extend')
  , load    = require('load-script')
  , isEmail = require('is-email')
  , utils   = require('../../utils');


module.exports = Intercom;

function Intercom () {

  // Whether Intercom has already been initialized or not. This is because
  // since we initialize Intercom on `identify`, people can make multiple
  // `identify` calls and we don't want that breaking anything.
  this.initialized = false;

  this.settings = {
    appId : null,

    // An optional setting to display the Intercom inbox widget.
    activator : null
  };
}


// Intercom identifies when the script is loaded, so instead of initializing
// in `initialize`, we store the settings for later and initialize in
// `identify`.
Intercom.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'appId');
  extend(this.settings, settings);
};


// Changes to the Intercom snippet:
//
// * Add `appId` from stored `settings`.
// * Add `userId`.
// * Add `userHash` for secure mode
Intercom.prototype.identify = function (userId, traits) {
  // If we've already been initialized once, don't do it again since we
  // load the script when this happens. Intercom can only handle one
  // identify call.
  if (this.initialized) return;

  // Don't do anything if we just have traits.
  if (!userId) return;

  // Pass traits directly in to Intercom's `custom_data`.
  var settings = window.intercomSettings = {
    app_id      : this.settings.appId,
    user_id     : userId,
    user_hash   : this.settings.userHash,
    custom_data : traits || {}
  };

  // Augment `intercomSettings` with some of the special traits.
  if (traits) {
    settings.email = traits.email;
    settings.name = traits.name;
    settings.created_at = analytics.utils.getSeconds(traits.created);
  }

  // If they didn't pass an email, check to see if the `userId` qualifies.
  if (isEmail(userId) && (traits && !traits.email)) {
    settings.email = userId;
  }

  // Optionally add the widget.
  if (this.settings.activator) {
    settings.widget = {
        activator : this.settings.activator
    };
  }

  load('https://api.intercom.io/api/js/library.js');

  // Set the initialized state, so that we don't initialize again.
  this.initialized = true;
};
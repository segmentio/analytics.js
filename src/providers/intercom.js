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
    load('https://static.intercomcdn.com/intercom.v1.js', ready);
  },

  identify : function (userId, traits, options) {
    // Don't do anything if we just have traits the first time.
    if (!this.booted && !userId) return;

    // Intercom specific settings. BACKWARDS COMPATIBILITY: we need to check for
    // the lowercase variant as well.
    options || (options = {});
    var Intercom = options.Intercom || options.intercom || {};
    traits.increments = Intercom.increments;
    traits.user_hash = Intercom.userHash || Intercom.user_hash;

    // They need `created_at` as a Unix timestamp (seconds).
    if (traits.created) {
      traits.created_at = Math.floor(traits.created/1000);
      delete traits.created;
    }

    // Convert a `company`'s `created` date.
    if (traits.company && traits.company.created) {
      traits.company.created_at = Math.floor(traits.company.created/1000);
      delete traits.company.created;
    }

    // Optionally add the inbox widget.
    if (this.options.activator) {
      traits.widget = {
        activator   : this.options.activator,
        use_counter : this.options.counter
      };
    }

    // If this is the first time we've identified, `boot` instead of `update`
    // and add our one-time boot settings.
    if (this.booted) {
      window.Intercom('update', traits);
    } else {
      extend(traits, {
        app_id  : this.options.appId,
        user_id : userId
      });
      window.Intercom('boot', traits);
    }

    // Set the booted state, so that we know to call 'update' next time.
    this.booted = true;
  },

  // Intercom doesn't have a separate `group` method, but they take a
  // `companies` trait for the user.
  group : function (groupId, properties, options) {
    properties.id = groupId;
    window.Intercom('update', { company : properties });
  }

});

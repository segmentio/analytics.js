// http://www.woopra.com/docs/setup/javascript-tracking/

var Provider = require('../provider')
  , each     = require('each')
  , extend   = require('extend')
  , isEmail  = require('is-email')
  , load     = require('load-script')
  , type     = require('type')
  , user     = require('../user');


module.exports = Provider.extend({

  name : 'Woopra',

  key : 'domain',

  defaults : {
    domain : null
  },

  initialize : function (options, ready) {
    // Woopra gives us a nice ready callback.
    var self = this;

    window.woopraReady = function (tracker) {
      tracker.setDomain(self.options.domain);
      tracker.setIdleTimeout(300000);

      var userId = user.id()
        , traits = user.traits();

      addTraits(userId, traits, tracker);
      tracker.track();

      ready();
      return false;
    };

    load('//static.woopra.com/js/woopra.js');
  },

  identify : function (userId, traits) {
    // We aren't guaranteed a tracker.
    if (!window.woopraTracker) return;
    addTraits(userId, traits, window.woopraTracker);
  },

  track : function (event, properties) {
    // We aren't guaranteed a tracker.
    if (!window.woopraTracker) return;

    // Woopra takes its `event` as the `name` key.
    properties || (properties = {});
    properties.name = event;

    window.woopraTracker.pushEvent(properties);
  }

});


/**
 * Convenience function for updating the userId and traits.
 *
 * @param {String} userId    The user's ID.
 * @param {Object} traits    The user's traits.
 * @param {Tracker} tracker  The Woopra tracker object.
 */

function addTraits (userId, traits, tracker) {
  // Move a `userId` into `traits`.
  if (userId) traits.id = userId;
  each(traits, function (key, value) {
    // Woopra seems to only support strings as trait values.
    if ('string' === type(value)) tracker.addVisitorProperty(key, value);
  });
}
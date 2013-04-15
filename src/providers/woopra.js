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

      self.addTraits(userId, traits, tracker);

      tracker.track();

      ready();
      return false;
    };

    load('//static.woopra.com/js/woopra.js');
  },

  identify : function (userId, traits) {

    if (!window.woopraTracker) return;

    this.addTraits(userId, traits, window.woopraTracker);
  },

  // Convenience function for updating the userId and traits.
  addTraits : function (userId, traits, tracker) {

    var addTrait = tracker.addVisitorProperty;

    if (userId) addTrait('id', userId);
    if (isEmail(userId)) addTrait('email', userId);

    // Seems to only support strings
    each(traits, function (name, trait) {
      if (type(trait) === 'string') addTrait(name, trait);
    });
  },

  track : function (event, properties) {
    // We aren't guaranteed a tracker.
    if (!window.woopraTracker) return;

    // Woopra takes its event as dictionaries with the `name` key.
    var settings = {};
    settings.name = event;

    // If we have properties, add them to the settings.
    if (properties) settings = extend({}, properties, settings);

    window.woopraTracker.pushEvent(settings);
  }

});
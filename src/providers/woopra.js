// Woopra
// ------
// [Documentation](http://www.woopra.com/docs/setup/javascript-tracking/).

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'domain',

  options : {
    domain : null
  },


  initialize : function (options, ready) {
    // Woopra gives us a nice ready callback.
    var self = this;
    window.woopraReady = function (tracker) {
      tracker.setDomain(self.options.domain);
      tracker.setIdleTimeout(300000);
      tracker.track();
      ready();
      return false;
    };

    load('//static.woopra.com/js/woopra.js');
  },


  identify : function (userId, traits) {
    // TODO - we need the cookie solution, because Woopra is one of those
    // that requires identify to happen before the script is requested.
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
// http://rollbar.com/

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Rollbar',

  key : 'accessToken',

  defaults : {
    accessToken : null,
    track: true,
    identify : true
  },

  initialize : function (options, ready) {
    var rollbarOptions = {
      checkIgnore: options.checkIgnore,
      context: options.context,
      itemsPerMinute: options.itemsPerMinute,
      level: options.level,
      'server.branch': options['server.branch'],
      'server.environment': options['server.environment'],
      'server.host': options['server.host']
    };
    window._rollbar = window._rollbar || 
                      window._ratchet || 
                      [options.accessToken, rollbarOptions];
    load('//d37gvrvc0wt4s1.cloudfront.net/js/6/rollbar.min.js');

    // Attach the window `onerror` event.
    window.onerror = function () {
      window._rollbar.push(arguments);
    };

    // Rollbar is ready right away since window._rollbar is available
    ready();
  },

  identify : function (userId, traits) {
    // Don't set any person metadata if identify is false
    if (!this.options.identify) return;

    traits = traits || {};
    if (userId) traits.id = userId;

    if (window._rollbar.shift) {
      var extraParams = window._rollbar[1] || {};
      extend(extraParams, {person: traits});
      window._rollbar[1] = extraParams;
    } else {
      var extraParams = window._rollbar.extraParams || {};
      extend(extraParams, {person: traits});
      window._rollbar.extraParams = extraParams;
    }
  },

  track: function (event, properties) {
    if (!this.options.track) return;

    var obj = extend({msg: event, level: 'info'}, properties);
    window._rollbar.push(obj);
  }

});

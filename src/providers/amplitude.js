// https://github.com/amplitude/Amplitude-Javascript

var Provider = require('../provider')
  , alias    = require('alias')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Amplitude',

  key : 'apiKey',

  defaults : {
    apiKey : null
  },

  initialize : function (options, ready) {
    // Create the Amplitude global and queuer methods.
    (function(e,t){var r=e.amplitude||{};
    r._q=[];function i(e){r[e]=function(){r._q.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
    var s=["init","logEvent","setUserId","setGlobalUserProperties","setVersionName"];
    for(var c=0;c<s.length;c++){i(s[c])}e.amplitude=r})(window,document);

    // Load the Amplitude script and initialize with the API key.
    load('https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-1.0-min.js');
    window.amplitude.init(options.apiKey);

    // Amplitude creates a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    if (userId) window.amplitude.setUserId(userId);
    if (traits) window.amplitude.setGlobalUserProperties(traits);
  },

  track : function (event, properties) {
    window.amplitude.logEvent(event, properties);
  }

});
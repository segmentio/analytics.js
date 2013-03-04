// Qualaroo
// --------
// [Identify Docs](http://help.qualaroo.com/customer/portal/articles/731085-identify-survey-nudge-takers)
// [Set Docs](http://help.qualaroo.com/customer/portal/articles/731091-set-additional-user-properties)

var Provider = require('../provider')
  , extend   = require('extend')
  , alias    = require('alias')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'apiKey',

  options : {
    customerId : null,
    siteToken  : null,
    track      : false
  },


  // Qualaroo's
  initialize : function (options, ready) {
    if (window._kiq) return;

    window._kiq = window._kiq || [];
    // '//s3.amazonaws.com/ki.js/47517/9Fd.js'
    // '//s3.amazonaws.com/ki.js/47516/9Fc.js'
    load('//s3.amazonaws.com/ki.js/' + options.customerId + '/' + options.siteToken + '.js');

    // Qualaroo creates a queue, so it's ready immediately.
    ready();
  },


  // Qualaroo uses two separate methods: `identify` for storing the
  // `userId`, and `set` for storing `traits`.
  identify : function (userId, traits) {
    if (userId) window._kiq.push(['identify', userId]);
    if (traits) window._kiq.push(['set', traits]);
  },


  // Qualaroo doesn't have `track` method yet, but to allow the users to do
  // targetted questionnaires we can set name-value pairs on the user properties
  // that apply to the current visit.
  track : function (event, properties) {
    if (!this.options.track) return;

    // Create a name-value pair that will be pretty unique. For an event like
    // 'Loaded a Page' this will make it 'Event: Loaded a Page'.
    var settings = {};
    settings['Event: ' + event] = true;

    window._kiq.push(['set', settings]);
  }

});
// http://help.qualaroo.com/customer/portal/articles/731085-identify-survey-nudge-takers
// http://help.qualaroo.com/customer/portal/articles/731091-set-additional-user-properties

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Qualaroo',

  defaults : {
    // Qualaroo has two required options.
    customerId : null,
    siteToken : null,
    // Whether to record traits when a user triggers an event. This can be
    // useful for sending targetted questionnaries.
    track : false
  },

  // Qualaroo's script has two options in its URL.
  initialize : function (options, ready) {
    window._kiq = window._kiq || [];
    load('//s3.amazonaws.com/ki.js/' + options.customerId + '/' + options.siteToken + '.js');

    // Qualaroo creates a queue, so it's ready immediately.
    ready();
  },

  // Qualaroo uses two separate methods: `identify` for storing the `userId`,
  // and `set` for storing `traits`.
  identify : function (userId, traits) {
    var identity = userId;
    if (traits && traits.email && !isEmail(userId)) identity = traits.email;
    if (identity) window._kiq.push(['identify', identity]);
    if (traits) window._kiq.push(['set', traits]);
  },

  // Qualaroo doesn't have `track` method yet, but to allow the users to do
  // targetted questionnaires we can set name-value pairs on the user properties
  // that apply to the current visit.
  track : function (event, properties) {
    if (!this.options.track) return;

    // Create a name-value pair that will be pretty unique. For an event like
    // 'Loaded a Page' this will make it 'Triggered: Loaded a Page'.
    var traits = {};
    traits['Triggered: ' + event] = true;

    // Fire a normal identify, with traits only.
    this.identify(null, traits);
  }

});
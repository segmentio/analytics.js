// https://github.com/Storyberg/Docs/wiki/Javascript-Library

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Storyberg',

  key : 'apiKey',

  options : {
    apiKey : null
  },

  initialize : function (options, ready) {
    window._sbq = window._sbq || [];
    window._sbk = options.apiKey;
    load('//storyberg.com/analytics.js');

    // Storyberg creates a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    // Don't do anything if we just have traits, because Storyberg
    // requires a `userId`.
    if (!userId) return;

    traits || (traits = {});

    // Storyberg takes the `userId` as part of the traits object
    traits.user_id = userId;

    // If there wasn't already an email and the userId is one, use it.
    if (!traits.email && isEmail(userId)) traits.email = userId;

    window._sbq.push(['identify', traits]);
  },

  track : function (event, properties) {
    properties || (properties = {});

    // Storyberg uses the event for the name, to avoid losing data
    if (properties.name) properties._name = properties.name;
    // Storyberg takes the `userId` as part of the properties object
    properties.name = event;

    window._sbq.push(['event', properties]);
  }

});

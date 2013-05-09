// http://www.preact.io/api/javascript

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');

module.exports = Provider.extend({

  name : 'Preact',

  key : 'projectCode',

  defaults : {
    projectCode    : null
  },

  initialize : function (options, ready) {
    var _lnq = window._lnq = window._lnq || [];
    _lnq.push(["_setCode", options.projectCode]);

    load('//d2bbvl6dq48fa6.cloudfront.net/js/ln-2.3.min.js');
    ready();
  },

  identify : function (userId, traits) {
    // Don't do anything if we just have traits, because Preact
    // requires a `userId`.
    if (!userId) return;

    // If there wasn't already an email and the userId is one, use it.
    if (!traits.email && isEmail(userId)) traits.email = userId;

    // Swap the `created` trait to the `created_at` that Preact needs
    // and convert it from milliseconds to seconds.
    if (traits.created) {
      traits.created_at = Math.floor(traits.created/1000);
      delete traits.created;
    }

    window._lnq.push(['_setPersonData', {
      name : traits.name,
      email : traits.email,
      uid : userId,
      properties : traits
    }]);
  },

  track : function (event, properties) {
    properties || (properties = {});

    var personEvent = {
      name : event,
      target_id : properties.target_id,
      note : properties.note,
      revenue : properties.revenue
    }

    window._lnq.push(['_logEvent', personEvent, properties]);
  }

});
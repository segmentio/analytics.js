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

    load('//d2bbvl6dq48fa6.cloudfront.net/js/ln-2.4.min.js');
    ready();
  },

  identify : function (userId, traits) {
    // Don't do anything if we just have traits. Preact requires a `userId`.
    if (!userId) return;

    // Swap the `created` trait to the `created_at` that Preact needs
    // and convert it from milliseconds to seconds.
    if (traits.created) {
      traits.created_at = Math.floor(traits.created/1000);
      delete traits.created;
    }

    window._lnq.push(['_setPersonData', {
      name       : traits.name,
      email      : traits.email,
      uid        : userId,
      properties : traits
    }]);
  },

  group : function (groupId, properties) {
    if (!groupId) return;
    properties.id = groupId;
    window._lnq.push(['_setAccount', properties]);
  },

  track : function (event, properties) {
    properties || (properties = {});

    // Preact takes a few special properties, and the rest in `extras`. So first
    // convert and remove the special ones from `properties`.
    var special = { name : event };

    // They take `revenue` in cents.
    if (properties.revenue) {
      special.revenue = properties.revenue * 100;
      delete properties.revenue;
    }

    if (properties.note) {
      special.note = properties.note;
      delete properties.note;
    }

    window._lnq.push(['_logEvent', special, properties]);
  }

});
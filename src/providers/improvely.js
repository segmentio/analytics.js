// http://www.improvely.com/docs/landing-page-code
// http://www.improvely.com/docs/conversion-code
// http://www.improvely.com/docs/labeling-visitors

var Provider = require('../provider')
  , alias    = require('alias')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Improvely',

  defaults : {
    // Improvely requires two options: `domain` and `projectId`.
    domain : null,
    projectId : null
  },

  initialize : function (options, ready) {
    window._improvely = window._improvely || [];
    window.improvely = window.improvely || {
      init  : function (e, t) { window._improvely.push(["init", e, t]); },
      goal  : function (e) { window._improvely.push(["goal", e]); },
      label : function (e) { window._improvely.push(["label", e]); }
    };

    load('//' + options.domain + '.iljmp.com/improvely.js');
    window.improvely.init(options.domain, options.projectId);

    // Improvely creates a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    if (userId) window.improvely.label(userId);
  },

  track : function (event, properties) {
    // Improvely calls `revenue` `amount`, and puts the `event` in properties as
    // the `type`.
    properties || (properties = {});
    properties.type = event;
    alias(properties, { 'revenue' : 'amount' });
    window.improvely.goal(properties);
  }

});

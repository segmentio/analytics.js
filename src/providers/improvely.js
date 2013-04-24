// http://www.improvely.com/docs/landing-page-code
// http://www.improvely.com/docs/conversion-code
// http://www.improvely.com/docs/labeling-visitors

var Provider = require('../provider')
  , alias    = require('alias')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Improvely',

  defaults : {
    // Improvely requires two options: `im_domain` and `im_project_id`.
    im_domain : null,
    im_project_id : 1
  },

  initialize : function (options, ready) {
    window._improvely = window._improvely || [];

    if (typeof window.improvely == 'undefined') {
        load('//' + options.im_domain + '.iljmp.com/improvely.js');
    }
    
    window.improvely = window.improvely || {};

    if (typeof window.improvely.init == 'undefined') {
        window.improvely.init = function (e, t) {
            window._improvely.push(["init", e, t]);
        };
        window.improvely.goal = function (e) {
            window._improvely.push(["goal", e]);
        };
        window.improvely.label = function (e) {
            window._improvely.push(["label", e]);
        }
    }

    window.improvely.init(options.im_domain, options.im_project_id);

    // Improvely creates a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    if (userId) window.improvely.label(userId);
  },

  track : function (event, properties) {
    // Improvely handles revenue with the `'amount'` property,
    // and the event name with the `'type'` property

    properties || (properties = {});
    properties.type = (properties.type || event);
    alias(properties, {
      'revenue' : 'amount'
    });

    window.improvely.goal(properties);
  }

});

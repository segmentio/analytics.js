// http://get.gaug.es/documentation/tracking/

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Gauges',

  key : 'siteId',

  defaults : {
    siteId : null
  },

  initialize : function (options, ready) {
    window._gauges = window._gauges || [];
    var script = load('//secure.gaug.es/track.js');
    // Gauges needs a few attributes on its script element.
    script.id = 'gauges-tracker';
    script.setAttribute('data-site-id', options.siteId);

    // Gauges make a queue so it's ready immediately.
    ready();
  },

  pageview : function (url) {
    window._gauges.push(['track']);
  }

});
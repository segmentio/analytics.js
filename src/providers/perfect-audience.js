// https://www.perfectaudience.com/docs#javascript_api_autoopen

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Perfect Audience',

  key : 'siteId',

  options : {
    siteId : null
  },

  initialize : function (options, ready) {
    window._pa || (window._pa = {});
    load('//tag.perfectaudience.com/serve/' + options.siteId + '.js', ready);
  },

  track : function (event, properties) {
    window._pa.track(event, properties);
  }

});
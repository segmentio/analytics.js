// Perfect Audience
// ----------------
// [Documentation](https://www.perfectaudience.com/docs#javascript_api_autoopen)

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'siteId',

  options : {
    siteId : null
  },


  initialize : function (options, ready) {
    window._pa = window._pa || {};
    load('//tag.perfectaudience.com/serve/' + options.siteId + '.js', ready);
  },


  track : function (event, properties) {
    // In case the Perfect Audience library hasn't loaded yet.
    if (!window._pa.track) return;

    window._pa.track(event, properties);
  }

});
// Chartbeat
// ---------
// [Documentation](http://chartbeat.com/docs/adding_the_code/),
// [documentation](http://chartbeat.com/docs/configuration_variables/),
// [documentation](http://chartbeat.com/docs/handling_virtual_page_changes/).

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');

var loadTime = new Date();

module.exports = Provider.extend({

  options : {
    // Chartbeat requires two options: `domain` and `uid`. All other
    // configuration options are passed straight in!
    domain : null,
    uid    : null
  },


  initialize : function (options, ready) {
    // Since all the custom options just get passed through, update the
    // Chartbeat `_sf_async_config` variable with options.
    window._sf_async_config = options;
    // Use the stored date from when we were loaded.
    window._sf_endpt = loadTime.getTime();

    load({
      http  : 'https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/js/chartbeat.js',
      https : 'http://static.chartbeat.com/js/chartbeat.js'
    }, ready);
  },


  pageview : function (url) {
    // In case the Chartbeat library hasn't loaded yet.
    if (!window.pSUPERFLY) return;

    // Requires a path, so default to the current one.
    window.pSUPERFLY.virtualPage(url || window.location.pathname);
  }

});
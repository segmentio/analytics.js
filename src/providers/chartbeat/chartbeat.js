// Chartbeat
// ---------
// [Documentation](http://chartbeat.com/docs/adding_the_code/),
// [documentation](http://chartbeat.com/docs/configuration_variables/),
// [documentation](http://chartbeat.com/docs/handling_virtual_page_changes/).

var utils = require('../../utils');


module.exports = Chartbeat;

function Chartbeat () {
  this.settings = {
    domain : null,
    uid    : null
  };
}


// Initialize
// ----------
// Changes to the Chartbeat snippet:
//
// * Pass `settings` directly as the config object.
// * Replaced the date with our stored `date` variable.
Chartbeat.prototype.initialize = function (settings) {

  settings = utils.resolveSettings(settings, 'uid');
  utils.extend(this.settings, settings);

  // Since all the custom settings just get passed through, update the
  // Chartbeat `_sf_async_config` variable with settings.
  window._sf_async_config = this.settings || {};

  (function(){
    // Use the stored date from when we were loaded.
    window._sf_endpt = analytics.date.getTime();
    var f = document.getElementsByTagName('script')[0];
    var e = document.createElement('script');
    e.setAttribute('language', 'javascript');
    e.setAttribute('type', 'text/javascript');
    e.setAttribute('src',
        (('https:' === document.location.protocol) ?
            'https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/' :
            'http://static.chartbeat.com/') +
        'js/chartbeat.js');
    f.parentNode.insertBefore(e, f);
  })();
};


Chartbeat.prototype.pageview = function (url) {
  if (!window.pSUPERFLY) return;

  window.pSUPERFLY.virtualPage(url || window.location.pathname);
};
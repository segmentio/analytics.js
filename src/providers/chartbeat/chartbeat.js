// Chartbeat
// ---------
// [Documentation](http://chartbeat.com/docs/adding_the_code/),
// [documentation](http://chartbeat.com/docs/configuration_variables/),
// [documentation](http://chartbeat.com/docs/handling_virtual_page_changes/).

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


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
  extend(this.settings, settings);

  // Since all the custom settings just get passed through, update the
  // Chartbeat `_sf_async_config` variable with settings.
  window._sf_async_config = this.settings || {};
  // Use the stored date from when we were loaded.
  window._sf_endpt = analytics.date.getTime();

  load({
    http  : 'https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/js/chartbeat.js',
    https : 'http://static.chartbeat.com/js/chartbeat.js'
  });
};


Chartbeat.prototype.pageview = function (url) {
  // In case the Chartbeat library hasn't loaded yet.
  if (!window.pSUPERFLY) return;

  // Requires a path, so default to the current one.
  window.pSUPERFLY.virtualPage(url || window.location.pathname);
};
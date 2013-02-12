// FoxMetrics
// -----------
// [Website] (http://foxmetrics.com)
// [Documentation](http://foxmetrics.com/documentation)
// [Documentation - JS](http://foxmetrics.com/documentation/apijavascript)
// [Support](http://support.foxmetrics.com)

var utils = require('../../utils');


module.exports = FoxMetrics;

function FoxMetrics () {
  this.settings = {
    appId : null
  };
}


// Initialize
// ----------
FoxMetrics.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'appId');
  utils.extend(this.settings, settings);

  var _fxm = window._fxm || {};
  window._fxm = _fxm.events || [];

  function _fxms(id) {
    (function () {
      var fxms = document.createElement('script'); fxms.type = 'text/javascript'; fxms.async = true;
      fxms.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'd35tca7vmefkrc.cloudfront.net/scripts/' + id + '.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(fxms, s);
      })();
  }

  _fxms(this.settings.appId);
};


// Identify
// --------

FoxMetrics.prototype.identify = function (userId, traits) {

  // user id is required for profile updates,
  // otherwise its a waste of resources as nothing will get updated
  if (userId) {
    // fxm needs first and last name seperately
    var fname = null, lname = null, email = null;
    if (traits) {
      fname = traits.name.split(' ')[0];
      lname = traits.name.split(' ')[1];
      email = typeof (traits.email) !== 'undefined' ? traits.email : null;
    }

    // we should probably remove name and email before passing as attributes
    window._fxm.push(['_fxm.visitor.Profile', userId, fname, lname, email, null, null, null, (traits || null)]);
  }
};


// Track
// -----

FoxMetrics.prototype.track = function (event, properties) {
  // send in null as event category name
  window._fxm.push([event, null, properties]);
};


// Pageview
// ----------

FoxMetrics.prototype.pageview = function (url) {
  // we are happy to accept traditional analytics :)
  // (title, name, categoryName, url, referrer)
  window._fxm.push(['_fxm.pages.view', null, null, null, (url || null), null]);
};
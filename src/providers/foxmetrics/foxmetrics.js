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

  // A `userId` is required for profile updates, otherwise its a waste of
  // resources as nothing will get updated.
  if (!userId) return;

  // FoxMetrics needs the first and last name seperately.
  var firstName = null, lastName = null, email = null;
  if (traits && traits.name) {
    firstName = traits.name.split(' ')[0];
    lastName = traits.name.split(' ')[1];
  }
  if (traits && traits.email) {
    email = traits.email;
  }

  // We should probably remove name and email before passing as attributes.
  window._fxm.push([
    '_fxm.visitor.profile',
    userId,          // user id
    firstName,       // first name
    lastName,        // last name
    email,           // email
    null,            // address
    null,            // social
    null,            // partners
    (traits || null) // attributes
  ]);
};


// Track
// -----

FoxMetrics.prototype.track = function (event, properties) {
  // Send in null as event category name.
  window._fxm.push([
    event,     // event name
    null,      // category
    properties // properties
  ]);
};


// Pageview
// ----------

FoxMetrics.prototype.pageview = function (url) {
  window._fxm.push([
    '_fxm.pages.view',
    null,          // title
    null,          // name
    null,          // category
    (url || null), // url
    null           // referrer
  ]);
};
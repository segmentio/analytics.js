// Errorception
// ------------
// [Documentation](http://errorception.com/).

var utils = require('../../utils');


module.exports = Errorception;

function Errorception () {
  this.settings = {
    projectId : null,

    // Whether to store metadata about the user on `identify` calls, using
    // the [Errorception `meta` API](http://blog.errorception.com/2012/11/capture-custom-data-with-your-errors.html).
    meta : true
  };
}


Errorception.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'projectId');
  utils.extend(this.settings, settings);

  var _errs = window._errs = window._errs || [settings.projectId];

  (function(a,b){
    a.onerror = function () {
      _errs.push(arguments);
    };
    var d = function () {
      var a = b.createElement('script'),
          c = b.getElementsByTagName('script')[0],
          protocol = ('https:' === document.location.protocol) ? 'https:' : 'http:';
      a.src = protocol + '//d15qhc0lu1ghnk.cloudfront.net/beacon.js';
      a.async = true;
      c.parentNode.insertBefore(a,c);
    };
    a.addEventListener ? a.addEventListener('load', d, !1) : a.attachEvent('onload', d);
  })(window,document);
};


Errorception.prototype.identify = function (userId, traits) {
  if (!traits) return;

  // If the custom metadata object hasn't ever been made, make it.
  window._errs.meta || (window._errs.meta = {});

  // Add all of the traits as metadata.
  if (this.settings.meta) analytics.utils.extend(window._errs.meta, traits);
};
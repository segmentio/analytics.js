// Errorception
// ------------
// [Documentation](http://errorception.com/).

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


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
  extend(this.settings, settings);

  window._errs = window._errs || [settings.projectId];

  // Attach the window `onerror` event.
  window.onerror = function () {
    window._errs.push(arguments);
  };

  load('//d15qhc0lu1ghnk.cloudfront.net/beacon.js');
};


Errorception.prototype.identify = function (userId, traits) {
  if (!traits) return;

  // If the custom metadata object hasn't ever been made, make it.
  window._errs.meta || (window._errs.meta = {});

  // Add all of the traits as metadata.
  if (this.settings.meta) analytics.utils.extend(window._errs.meta, traits);
};
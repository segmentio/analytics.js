// Clicky
// ------
// [Documentation](http://clicky.com/help/customization/manual?new-domain).

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = Clicky;

function Clicky () {
  this.settings = {
    siteId : null
  };
}


Clicky.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'siteId');
  extend(this.settings, settings);

  window.clicky_site_ids = window.clicky_site_ids || [];
  window.clicky_site_ids.push(this.settings.siteId);

  load('//static.getclicky.com/js');
};


Clicky.prototype.track = function (event, properties) {
  // In case the Clicky library hasn't loaded yet.
  if (!window.clicky) return;

  // We aren't guaranteed `clicky` is available until the script has been
  // requested and run, hence the check.
  window.clicky.log(window.location.href, event);
};
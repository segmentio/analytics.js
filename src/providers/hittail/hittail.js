// HitTail
// -------
// [Documentation](www.hittail.com).

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = HitTail;

function HitTail () {
  this.settings = {
    siteId : null
  };
}


HitTail.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'siteId');
  extend(this.settings, settings);

  load('//' + this.settings.siteId + '.hittail.com/mlt.js');
};
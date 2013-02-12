// USERcycle
// -----------
// [Documentation](http://docs.usercycle.com/javascript_api).

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = USERcycle;

function USERcycle () {
  this.settings = {
    key : null
  };
}


USERcycle.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'key');
  extend(this.settings, settings);

  window._uc = window._uc || [];
  window._uc.push(['_key', this.settings.key]);

  load('//api.usercycle.com/javascripts/track.js');
};


USERcycle.prototype.identify = function (userId, traits) {
  if (userId) window._uc.push(['uid', userId, traits]);
};


USERcycle.prototype.track = function (event, properties) {
  window._uc.push(['action', event, properties]);
};
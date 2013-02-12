// USERcycle
// -----------
// [Documentation](http://docs.usercycle.com/javascript_api).

var utils = require('../../utils');


module.exports = USERcycle;

function USERcycle () {
  this.settings = {
    key : null
  };
}


USERcycle.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'key');
  utils.extend(this.settings, settings);

  var _uc = window._uc = window._uc || [];
  (function(){
    var e = document.createElement('script');
    e.setAttribute('type', 'text/javascript');
    var protocol = 'https:' === document.location.protocol ? 'https://' : 'http://';
    e.setAttribute('src', protocol+'api.usercycle.com/javascripts/track.js');
    var f = document.getElementsByTagName('script')[0];
    f.parentNode.insertBefore(e, f);
  })();

  window._uc.push(['_key', settings.key]);
};


USERcycle.prototype.identify = function (userId, traits) {
  if (userId) window._uc.push(['uid', userId, traits]);
};


USERcycle.prototype.track = function (event, properties) {
  window._uc.push(['action', event, properties]);
};
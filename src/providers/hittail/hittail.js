// HitTail
// -------
// [Documentation](www.hittail.com).

var utils = require('../../utils');


module.exports = HitTail;

function HitTail () {
  this.settings = {
    siteId : null
  };
}


HitTail.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'siteId');
  utils.extend(this.settings, settings);

  var siteId = settings.siteId;
  (function(){
    var ht = document.createElement('script');
    ht.async = true;
    ht.type = 'text/javascript';
    ht.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + siteId + '.hittail.com/mlt.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ht, s);
  })();
};
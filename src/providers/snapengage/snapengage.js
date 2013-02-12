// SnapEngage
// ----------
// [Documentation](http://help.snapengage.com/installation-guide-getting-started-in-a-snap/).
var utils = require('../../utils');


module.exports = SnapEngage;

function SnapEngage () {
  this.settings = {
    apiKey : null
  };
}


// Changes to the SnapEngage snippet:
//
// * Add `apiKey` from stored `settings`.
SnapEngage.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'apiKey');
  utils.extend(this.settings, settings);

  var self = this;
  (function() {
    var se = document.createElement('script');
    se.type = 'text/javascript';
    se.async = true;
    var protocol = ('https:' === document.location.protocol) ? 'https:' : 'http:';
    se.src = protocol + '//commondatastorage.googleapis.com/code.snapengage.com/js/'+self.settings.apiKey+'.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(se, s);
  })();
};
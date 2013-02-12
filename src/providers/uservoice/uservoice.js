// UserVoice
// ---------
// [Documentation](http://feedback.uservoice.com/knowledgebase/articles/16797-how-do-i-customize-and-install-the-uservoice-feedb).

var utils = require('../../utils');


module.exports = UserVoice;

function UserVoice () {
  this.settings = {
    widgetId : null
  };
}


UserVoice.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'widgetId');
  utils.extend(this.settings, settings);

  window.uvOptions = {};
  (function() {
    var uv = document.createElement('script'); uv.type = 'text/javascript'; uv.async = true;
    uv.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'widget.uservoice.com/' + settings.widgetId + '.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(uv, s);
  })();
};
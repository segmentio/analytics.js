// UserVoice
// ---------
// [Documentation](http://feedback.uservoice.com/knowledgebase/articles/16797-how-do-i-customize-and-install-the-uservoice-feedb).

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = UserVoice;

function UserVoice () {
  this.settings = {
    widgetId : null
  };
}


UserVoice.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'widgetId');
  extend(this.settings, settings);

  window.uvOptions = {};
  load('//widget.uservoice.com/' + this.settings.widgetId + '.js');
};
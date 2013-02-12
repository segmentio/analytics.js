// SnapEngage
// ----------
// [Documentation](http://help.snapengage.com/installation-guide-getting-started-in-a-snap/).
var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = SnapEngage;

function SnapEngage () {
  this.settings = {
    apiKey : null
  };
}


SnapEngage.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'apiKey');
  extend(this.settings, settings);

  load('//commondatastorage.googleapis.com/code.snapengage.com/js/' + this.settings.apiKey + '.js');
};
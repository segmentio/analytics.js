// Quantcast
// ---------
// [Documentation](https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/)

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = Quantcast;

function Quantcast () {
  this.settings = {
    pCode : null
  };
}


Quantcast.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'pCode');
  extend(this.settings, settings);

  window._qevents = window._qevents || [];
  window._qevents.push({ qacct: this.settings.pCode });

  load({
    http  : 'http://edge.quantserve.com/quant.js',
    https : 'https://secure.quantserve.com/quant.js'
  });
};
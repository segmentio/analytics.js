// Quantcast
// ---------
// [Documentation](https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/)

var utils = require('../../utils');


module.exports = Quantcast;

function Quantcast () {

  this.settings = {
    pCode : null
  };
}


Quantcast.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'pCode');
  utils.extend(this.settings, settings);

  var _qevents = window._qevents = window._qevents || [];

  (function() {
    var elem = document.createElement('script');
    elem.src = (document.location.protocol == 'https:' ? 'https://secure' : 'http://edge') + '.quantserve.com/quant.js';
    elem.async = true;
    elem.type = 'text/javascript';
    var scpt = document.getElementsByTagName('script')[0];
    scpt.parentNode.insertBefore(elem, scpt);
  })();

  _qevents.push({qacct: settings.pCode});

  // NOTE: the <noscript><div><img> bit in the docs is ignored
  // because we have to run JS in order to do any of this!
};
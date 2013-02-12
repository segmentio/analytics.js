// comScore
// ---------
// [Documentation](http://direct.comscore.com/clients/help/FAQ.aspx#faqTagging)

var utils = require('../../utils');


module.exports = ComScore;

function ComScore () {
  this.settings = {
    c1 : '2',
    c2 : null
  };
}


ComScore.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'c2');
  utils.extend(this.settings, settings);

  var _comscore = window._comscore = window._comscore || [];
  _comscore.push(this.settings);

  (function() {
    var s = document.createElement('script');
    var el = document.getElementsByTagName('script')[0];
    s.async = true;
    s.src = (document.location.protocol === 'https:' ? 'https://sb' : 'http://b') + '.scorecardresearch.com/beacon.js';
    el.parentNode.insertBefore(s, el);
  })();

  // NOTE: the <noscript><img> bit in the docs is ignored
  // because we have to run JS in order to do any of this!
};



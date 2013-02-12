// comScore
// ---------
// [Documentation](http://direct.comscore.com/clients/help/FAQ.aspx#faqTagging)

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = ComScore;

function ComScore () {
  this.settings = {
    c1 : '2',
    c2 : null
  };
}


ComScore.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'c2');
  extend(this.settings, settings);

  window._comscore = window._comscore || [];
  window._comscore.push(this.settings);

  load({
    http  : 'http://b.scorecardresearch.com/beacon.js',
    https : 'https://sb.scorecardresearch.com/beacon.js'
  });
};
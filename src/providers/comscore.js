// comScore
// ---------
// [Documentation](http://direct.comscore.com/clients/help/FAQ.aspx#faqTagging)

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'c2',

  options : {
    c1 : '2',
    c2 : null
  },


  initialize : function (options) {
    window._comscore = window._comscore || [];
    window._comscore.push(options);
    load({
      http  : 'http://b.scorecardresearch.com/beacon.js',
      https : 'https://sb.scorecardresearch.com/beacon.js'
    });
  }

});
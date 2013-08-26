// http://direct.comscore.com/clients/help/FAQ.aspx#faqTagging

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'comScore',

  key : 'c2',

  defaults : {
    c1 : '2',
    c2 : null
  },

  // Pass the entire options object directly into comScore.
  initialize : function (options, ready) {
    window._comscore = window._comscore || [];
    window._comscore.push(options);
    load({
      http  : 'http://b.scorecardresearch.com/beacon.js',
      https : 'https://sb.scorecardresearch.com/beacon.js'
    }, ready);
  }

});
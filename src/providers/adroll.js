// https://www.adroll.com/dashboard

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'AdRoll',

  defaults : {
    // Adroll requires two options: `advId` and `pixId`.
    advId : null,
    pixId : null
  },

  initialize : function (options, ready) {
    window.adroll_adv_id = options.advId;
    window.adroll_pix_id = options.pixId;
    window.__adroll_loaded = true;

    load({
      http  : 'http://a.adroll.com/j/roundtrip.js',
      https : 'https://s.adroll.com/j/roundtrip.js'
    }, ready);
  }

});
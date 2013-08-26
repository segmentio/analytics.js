// https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Quantcast',

  key : 'pCode',

  defaults : {
    pCode : null
  },

  initialize : function (options, ready) {
    window._qevents = window._qevents || [];
    window._qevents.push({ qacct: options.pCode });
    load({
      http  : 'http://edge.quantserve.com/quant.js',
      https : 'https://secure.quantserve.com/quant.js'
    }, ready);
  }

});
var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'CrazyEgg',

  key : 'accountNumber',

  defaults : {
    accountNumber : null
  },

  initialize : function (options, ready) {
    var accountPath = options.accountNumber.slice(0,4) + '/' + options.accountNumber.slice(4);
    load('//dnn506yrbagrg.cloudfront.net/pages/scripts/'+accountPath+'.js?'+Math.floor(new Date().getTime()/3600000), ready);
  }

});
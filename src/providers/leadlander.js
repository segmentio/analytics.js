var Provider = require('../provider')
  , load     = require('load-script');

module.exports = Provider.extend({

  name : 'LeadLander',

  key : 'llactid',

  defaults : {
    llactid : null
  },

  initialize : function (options, ready) {
    window.llactid = options.llactid;
    load('//trackalyzer.com/trackalyze.js', ready);
  }

});
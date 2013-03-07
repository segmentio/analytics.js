// HitTail
// -------
// [Documentation](www.hittail.com).

var Provider = require('../provider')
  , load   = require('load-script');


module.exports = Provider.extend({

  key : 'siteId',

  options : {
    siteId : null
  },


  initialize : function (options, ready) {
    load('//' + options.siteId + '.hittail.com/mlt.js', ready);
  }

});
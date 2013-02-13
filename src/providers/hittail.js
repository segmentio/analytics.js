// HitTail
// -------
// [Documentation](www.hittail.com).

var Provider = require('../provider')
  , extend = require('extend')
  , load   = require('load-script');


module.exports = Provider.extend({

  key : 'siteId',

  options : {
    siteId : null
  },


  initialize : function (options) {
    load('//' + options.siteId + '.hittail.com/mlt.js');
  }

});
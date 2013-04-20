var date     = require('load-date')
  , Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Pingdom',

  key : 'id',

  defaults : {
    id : null
  },

  initialize : function (options, ready) {

    window._prum = [['id', '5168f8c6abe53db732000000'],
                 ['mark', 'firstbyte', date.getTime()]];

    // We've replaced the original snippet loader with our own load method.
    load('//rum-static.pingdom.net/prum.min.js', ready);
  }

});
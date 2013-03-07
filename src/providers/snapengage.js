// SnapEngage
// ----------
// [Documentation](http://help.snapengage.com/installation-guide-getting-started-in-a-snap/).

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'apiKey',

  options : {
    apiKey : null
  },


  initialize : function (options, ready) {
    load('//commondatastorage.googleapis.com/code.snapengage.com/js/' + options.apiKey + '.js', ready);
  }

});
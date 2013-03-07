// UserVoice
// ---------
// [Documentation](http://feedback.uservoice.com/knowledgebase/articles/16797-how-do-i-customize-and-install-the-uservoice-feedb).

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'widgetId',

  options : {
    widgetId : null
  },


  initialize : function (options, ready) {
    window.uvOptions = {};
    load('//widget.uservoice.com/' + options.widgetId + '.js', ready);
  }

});
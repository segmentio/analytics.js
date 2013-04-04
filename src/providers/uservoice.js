// http://feedback.uservoice.com/knowledgebase/articles/225-how-do-i-pass-custom-data-through-the-widget-and-i

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'UserVoice',

  key : 'widgetId',

  options : {
    widgetId : null
  },

  initialize : function (options, ready) {
    window.UserVoice = [];
    load('//widget.uservoice.com/' + options.widgetId + '.js', ready);
  }

});
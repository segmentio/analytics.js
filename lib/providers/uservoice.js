
var Provider = require('../provider')
  , load     = require('load-script')
  , alias    = require('alias')
  , clone    = require('clone');


module.exports = Provider.extend({

  name : 'UserVoice',

  key: 'widgetId',

  defaults : {
    widgetId : null
  },

  initialize : function (options, ready) {
    window.UserVoice = window.UserVoice || [];
    load('//widget.uservoice.com/' + options.widgetId + '.js', ready);

    // BACKWARDS COMPATIBILITY: noop this old method, so we don't break sites
    window.showClassicWidget = function(){};
  },

  identify : function (userId, traits) {
    // Pull the ID into traits.
    traits.id = userId;
    window.UserVoice.push(['setCustomFields', traits]);
  }

});
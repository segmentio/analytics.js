// http://feedback.uservoice.com/knowledgebase/articles/225-how-do-i-pass-custom-data-through-the-widget-and-i

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'UserVoice',

  defaults : {
    // These first two options are required.
    widgetId          : null,
    forum_id          : null,
    // Should we show the tab automatically?
    showTab           : true,
    // There's tons of options for the tab.
    mode              : 'full',
    primary_color     : '#cc6d00',
    link_color        : '#007dbf',
    default_mode      : 'support',
    support_tab_name  : null,
    feedback_tab_name : null,
    tab_label         : 'Feedback & Support',
    tab_color         : '#cc6d00',
    tab_position      : 'middle-right',
    tab_inverted      : false
  },

  initialize : function (options, ready) {
    window.UserVoice = window.UserVoice || [];
    load('//widget.uservoice.com/' + options.widgetId + '.js', ready);

    // If we don't automatically show the tab, let them show it via 
    // javascript. This is the default name for the function in their snippet.
    window.showClassicWidget = function (showWhat) {
      UserVoice.push([showWhat || 'showLightbox', 'classic_widget', options]);
    };

    // If we *do* automatically show the tab, get on with it!
    if (options.showTab)
      window.showClassicWidget('showTab');
  }

});
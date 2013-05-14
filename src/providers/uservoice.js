// http://feedback.uservoice.com/knowledgebase/articles/225-how-do-i-pass-custom-data-through-the-widget-and-i

var Provider = require('../provider')
  , load     = require('load-script')
  , alias    = require('alias')
  , clone    = require('clone');


module.exports = Provider.extend({

  name : 'UserVoice',

  defaults : {
    // These first two options are required.
    widgetId          : null,
    forumId           : null,
    // Should we show the tab automatically?
    showTab           : true,
    // There's tons of options for the tab.
    mode              : 'full',
    primaryColor      : '#cc6d00',
    linkColor         : '#007dbf',
    defaultMode       : 'support',
    supportTabName    : null,
    feedbackTabName   : null,
    tabLabel          : 'Feedback & Support',
    tabColor          : '#cc6d00',
    tabPosition       : 'middle-right',
    tabInverted       : false
  },

  initialize : function (options, ready) {
    window.UserVoice = window.UserVoice || [];
    load('//widget.uservoice.com/' + options.widgetId + '.js', ready);

    var optionsClone = clone(options);
    alias(optionsClone, {
      'forumId'         : 'forum_id',
      'primaryColor'    : 'primary_color',
      'linkColor'       : 'link_color',
      'defaultMode'     : 'default_mode',
      'supportTabName'  : 'support_tab_name',
      'feedbackTabName' : 'feedback_tab_name',
      'tabLabel'        : 'tab_label',
      'tabColor'        : 'tab_color',
      'tabPosition'     : 'tab_position',
      'tabInverted'     : 'tab_inverted'
    });

    // If we don't automatically show the tab, let them show it via
    // javascript. This is the default name for the function in their snippet.
    window.showClassicWidget = function (showWhat) {
      window.UserVoice.push([showWhat || 'showLightbox', 'classic_widget', optionsClone]);
    };

    // If we *do* automatically show the tab, get on with it!
    if (options.showTab) {
      window.showClassicWidget('showTab');
    }
  },

  identify : function (userId, traits) {
    // Pull the ID into traits.
    traits.id = userId;

    window.UserVoice.push(['setCustomFields', traits]);
  }

});
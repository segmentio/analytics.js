// ClickTale
// ---------
// [Documentation](http://wiki.clicktale.com/Article/JavaScript_API).

var date     = require('load-date')
  , Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');

module.exports = Provider.extend({

  key : 'projectId',

  options : {
    normalCDNUrl   : 'http://s.clicktale.net/WRe0.js',
    secureCDNUrl   : null,

    projectId      : null,
    recordingRatio : 0.01,
    partitionId    : null
  },


  initialize : function (options, ready) {

    window.WRInitTime = date.getTime();

    var onloaded = function () {
      window.ClickTale(options.projectId, options.recordingRatio, options.partitionId);
      ready();
    };

    // Load the appropriate CDN library, if no
    // ssl library is provided and we're on ssl then
    // we can't load anything... (for non-premium accounts.)
    if (document.location.protocol !== 'https:')
      load(options.normalCDNUrl, onloaded);
    else if (options.secureCDNUrl)
      load(options.secureCDNUrl, onloaded);
  },

  identify : function (userId, traits) {
    if (window.ClickTaleSetUID) window.ClickTaleSetUID(userId);

    if (window.ClickTaleField) {
      for (var traitKey in traits) {
        window.ClickTaleField(traitKey, traits[traitKey]);
      }
    }
  },

  track : function (event, properties) {
    if (window.ClickTaleEvent) window.ClickTaleEvent(event);
  }

});
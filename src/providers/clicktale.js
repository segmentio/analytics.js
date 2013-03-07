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

    // There's a default insecure CDN url that most projects seem to use.
    normalCDNUrl   : 'http://s.clicktale.net/WRe0.js',

    // SSL support is only for premium accounts.
    secureCDNUrl   : null,

    // The Project ID is loaded in after the ClickTale CDN javascript has loaded.
    projectId      : null,

    // The recording ratio specifies what fraction of people to screen-record.
    // ClickTale has a special calculator in their setup flow that tells you
    // what number to set for this.
    recordingRatio : 0.01,

    // The Partition ID determines where ClickTale stores the data according to 
    // http://wiki.clicktale.com/Article/JavaScript_API
    partitionId    : null
  },


  initialize : function (options, ready) {

    // ClickTale wants this at the "top" of the page. The
    // analytics.js snippet sets this date synchronously now,
    // and  makes it available via load-date.
    window.WRInitTime = date.getTime();

    var onloaded = function () {
      window.ClickTale(options.projectId, options.recordingRatio, options.partitionId);
      ready();
    };

    // Load the appropriate CDN library, if no
    // ssl library is provided and we're on ssl then
    // we can't load anything (always true for non-premium accounts.)
    if (document.location.protocol !== 'https:')
      load(options.normalCDNUrl, onloaded);
    else if (options.secureCDNUrl)
      load(options.secureCDNUrl, onloaded);
  },

  identify : function (userId, traits) {
    // We set the userId as the ClickTale UID.
    if (window.ClickTaleSetUID) window.ClickTaleSetUID(userId);

    // We iterate over all the traits and set them as key-value field pairs.
    if (window.ClickTaleField) {
      for (var traitKey in traits) {
        window.ClickTaleField(traitKey, traits[traitKey]);
      }
    }
  },

  track : function (event, properties) {
    // ClickTaleEvent is an alias for ClickTaleTag
    if (window.ClickTaleEvent) window.ClickTaleEvent(event);
  }

});
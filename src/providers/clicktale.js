// http://wiki.clicktale.com/Article/JavaScript_API

var date     = require('load-date')
  , Provider = require('../provider')
  , load     = require('load-script');

module.exports = Provider.extend({

  name : 'ClickTale',

  key : 'projectId',

  defaults : {

    // If you sign up for a free account, this is the default http (non-ssl) CDN URL
    // that you get. If you sign up for a premium account, you get a different
    // custom CDN URL, so we have to leave it as an option.
    httpCdnUrl     : 'http://s.clicktale.net/WRe0.js',

    // SSL support is only for premium accounts. Each premium account seems to have
    // a different custom secure CDN URL, so we have to leave it as an option.
    httpsCdnUrl    : null,

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

    // If we're on https:// but don't have a secure library, return early.
    if (document.location.protocol === 'https:' && !options.httpsCdnUrl) return;

    // ClickTale wants this at the "top" of the page. The
    // analytics.js snippet sets this date synchronously now,
    // and  makes it available via load-date.
    window.WRInitTime = date.getTime();


    // Make the `<div>` element and insert it at the end of the body.
    var createClickTaleDiv = function () {
      // loop until the body is actually available
      if (!document.body) return setTimeout(createClickTaleDiv, 5);

      var div = document.createElement('div');
      div.setAttribute('id', 'ClickTaleDiv');
      div.setAttribute('style', 'display: none;');
      document.body.appendChild(div);
    };
    createClickTaleDiv();

    var onloaded = function () {
      window.ClickTale(options.projectId, options.recordingRatio, options.partitionId);
      ready();
    };

    // Load the appropriate CDN library, if no
    // ssl library is provided and we're on ssl then
    // we can't load anything (always true for non-premium accounts.)
    load({
      http  : options.httpCdnUrl,
      https : options.httpsCdnUrl
    }, onloaded);
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
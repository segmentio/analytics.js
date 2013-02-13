// Bitdeli
// -------
// * [Documentation](https://bitdeli.com/docs)
// * [JavaScript API Reference](https://bitdeli.com/docs/javascript-api.html)

var Provider = require('../provider')
  , type     = require('type')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  options : {
    // BitDeli requires two options: `inputId` and `authToken`.
    inputId   : null,
    authToken : null,

    // Whether or not to track an initial pageview when the page first
    // loads. You might not want this if you're using a single-page app.
    initialPageview : true
  },


  initialize : function (options) {
    if (!options.inputId || !options.authToken) {
      throw new Error("Settings must be an object with properties 'inputId' and 'authToken'.");
    }

    window._bdq = window._bdq || [];
    window._bdq.push(["setAccount", options.inputId, options.authToken]);
    load('//d2flrkr957qc5j.cloudfront.net/bitdeli.min.js');

    if (options.initialPageview) this.pageview();
  },


  // Bitdeli uses two separate methods: `identify` for storing the `userId`
  // and `set` for storing `traits`.
  identify : function (userId, traits) {
    if (userId) window._bdq.push(['identify', userId]);
    if (traits) window._bdq.push(['set', traits]);
  },


  track : function (event, properties) {
    window._bdq.push(['track', event, properties]);
  },


  // If `url` is undefined, Bitdeli uses the current page URL instead.
  pageview : function (url) {
    window._bdq.push(['trackPageview', url]);
  }

});
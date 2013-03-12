// Bitdeli
// -------
// * [Documentation](https://bitdeli.com/docs)
// * [JavaScript API Reference](https://bitdeli.com/docs/javascript-api.html)

var Provider = require('../provider')
  , type     = require('type')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Bitdeli',

  options : {
    // BitDeli requires two options: `inputId` and `authToken`.
    inputId : null,
    authToken : null,
    // Whether or not to track an initial pageview when the page first
    // loads. You might not want this if you're using a single-page app.
    initialPageview : true,
    // Whether to track log calls, prefixing them with "Log: ".
    log : false
  },


  initialize : function (options, ready) {
    window._bdq = window._bdq || [];
    window._bdq.push(["setAccount", options.inputId, options.authToken]);

    if (options.initialPageview) this.pageview();

    load('//d2flrkr957qc5j.cloudfront.net/bitdeli.min.js');

    // Bitdeli just uses a queue, so it's ready right away.
    ready();
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
  },

  log : function (error, properties) {
    if (!this.options.log) return;

    // Bitdeli only tracks messages, so turn Error's into strings.
    // TODO: make this cross-browser.
    if ('string' === type(error)) error = error.message;

    // Prepend log, incase they're also tracking regular events.
    error = 'Log: ' + error;

    this.track(error, properties);
  }

});
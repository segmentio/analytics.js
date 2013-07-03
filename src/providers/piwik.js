  // http://piwik.org/docs/javascript-tracking/#toc-asynchronous-tracking

  var Provider  = require('../provider')
    , load      = require('load-script')
    , type      = require('type')
    , url       = require('url')
    , canonical = require('canonical');


  module.exports = Provider.extend({

    name : 'Piwik',

    defaults : {
      url : null,
      id : null,
    },

    initialize : function (options, ready) {

      var scheme = ("https:" == document.location.protocol)  ? 'https://' : 'http://';
      var domain = options.url;

      window._paq = window._paq || [];
      window._paq.push(['setSiteId', options.id]);

      window._paq.push(['setTrackerUrl', scheme + domain + '/piwik.php']); 
      window._paq.push(['trackPageView']); 
      window._paq.push(['enableLinkTracking']); 


      load({
          http  : 'http://' + domain + "/piwik.js",
          https : 'https://' + domain + "/piwik.js",
      }, ready);
    },

    pageview : function(url) {

      window._paq.push(['trackPageView']);

    },

  });
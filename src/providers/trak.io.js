// https://docs.trak.io

var Provider = require('../provider')
  , alias    = require('alias')
  , isEmail  = require('is-email')
  , load     = require('load-script');

module.exports = Provider.extend({

  name : 'trak.io',

  key : 'api_token',

  defaults : {
    // The trak.io API token for your account.
    token : null,
    // A customer context object
    context: {},
    // A custom chanel to use
    channel: null,
    // Whether to auto track page views
    auto_track_page_views: true
  },

  initialize : function (options, ready) {

    window.trak = window.trak || [];
    window.trak.io = window.trak.io || {};
    window.trak.io.load = function(e) {
      var t = document.createElement("script");
      t.type = "text/javascript"
      ,t.async =! 0
      ,t.src = ("https:" === document.location.protocol ? "https://":"http://") + "d29p64779x43zo.cloudfront.net/v1/trak.io.min.js";
      var n = document.getElementsByTagName("script")[0];
      n.parentNode.insertBefore(t,n);
      var r = function(e) {
        return function() {
          window.trak.push([e].concat(Array.prototype.slice.call(arguments,0)))
        }
      }
      ,i=["initialize","identify","track","alias","channel","source","host","protocol","page_view"];
      for (var s=0;s<i.length;s++) trak.io[i[s]]=r(i[s]);
      trak.io.initialize.apply(trak.io,arguments)
    };

    // Pass options directly to `init` as the second argument.
    window.trak.io.load(options.api_token, options);

    // trak.io makes a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    if (userId) {
      window.trak.io.identify(userId, traits);
    } else {
      window.trak.io.identify(traits);
    }
  },

  track : function (event, properties) {
    window.trak.io.track(event, properties);
  },

  pageview : function (url) {
    window.trak.io.page_view(url);
  },

  alias : function (newId, originalId) {

    if(window.trak.io.distinct_id() === newId) return;

    if (originalId)
      window.trak.io.alias(originalId, newId);
    else
      window.trak.io.alias(newId);
  }

});
// http://www.woopra.com/docs/setup/javascript-tracking/

var Provider = require('../provider')
  , each     = require('each')
  , extend   = require('extend')
  , isEmail  = require('is-email')
  , load     = require('load-script')
  , type     = require('type')
  , user     = require('../user');


module.exports = Provider.extend({

  name : 'Woopra',

  key : 'domain',

  defaults : {
    domain : null,
    // whether to track a page view on initial page load
    initialPageview : true
  },

  initialize : function (options, ready) {
    // the Woopra snippet, minus the async script loading
    (function () {
      var i, s, z, w = window, d = document, a = arguments, q = 'script',
        f = ['config', 'track', 'identify', 'visit', 'push', 'call'],
        c = function () {
          var i, self = this;
          self._e = [];
          for (i = 0; i < f.length; i++) {
            (function (f) {
              self[f] = function () {
                // need to do this so params get called properly
                self._e.push([f].concat(Array.prototype.slice.call(arguments, 0)));
                return self;
              };
            })(f[i]);
          }
        };
      w._w = w._w || {};
      // check if instance of tracker exists
      for (i = 0; i < a.length; i++) {
        w._w[a[i]] = w[a[i]] = w[a[i]] || new c();
      }
    })('woopra');

    load('//static.woopra.com/js/w.js', ready);

    window.woopra.config({
      domain: options.domain
    });

    if (options.initialPageview) this.pageview();
  },

  identify : function (id, traits) {
    if (id) traits.id = id;
    // `push` calls identify without sending an event
    window.woopra.identify(traits).push();
  },

  track : function (event, properties) {
    window.woopra.track(event, properties);
  },

  pageview : function (url, options) {
    window.woopra.track('pv', {
      url: url || window.location.pathname,
      title: document.title
    });
  }

});

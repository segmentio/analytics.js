// Lytics
// --------
// [Documentation](http://admin.lytics.io/doc#jstag),

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Lytics',

  key : 'cid',

  defaults : {
    // Account identifier (required)
    cid: null,
    // Collector URL
    url: '//c.lytics.io',
    // How long to give collector requests
    delay: 200,
    // Cookie name storing unique identifier
    cookie: 'seerid',
    // Lytics data stream (optional), a string identifier of this data type
    stream: null,
    // Length of time before considering a session inactive
    sessecs: 1800,
    // Transport mechanism: 'Form' or 'Gif'
    channel: 'Form',
    // Query string parameters to automatically to events
    qsargs: [],
    // Whether to load minified or unminified source
    minified: true,
    // Should we capture initial Page view on load?
    initialPageview: true
  },

  initialize : function (options, ready) {
    window.jstag = (function () {
      var t = {
        _q: [],
        _c: extend(options),
        ts: (new Date()).getTime()
      };
      t.send = function() {
        this._q.push([ 'ready', 'send', Array.prototype.slice.call(arguments) ]);
        return this;
      };
      return t;
    })();

    load('//c.lytics.io/static/io' + (options.minified ? '.min' : '') + '.js');

    if (options.initialPageview) {
      this.pageview();
    }

    ready();
  },

  identify: function (userId, traits) {
    traits._uid = userId;
    window.jstag.send(traits);
  },

  track: function (event, properties) {
    properties._e = event;
    window.jstag.send(properties);
  },

  pageview: function (url) {
    window.jstag.send();
  }

});
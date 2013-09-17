
var each     = require('each')
  , extend   = require('extend')
  , integration = require('../integration')
  , isEmail  = require('is-email')
  , load     = require('load-script')
  , type     = require('type')
  , user     = require('../user');


/**
 * Expose `Woopra` integration.
 *
 * http://www.woopra.com/docs/setup/javascript-tracking/
 */

var Woopra = module.exports = integration('Woopra');


/**
 * Required key.
 */

Woopra.prototype.key = 'domain';


/**
 * Default options.
 */

Woopra.prototype.defaults = {
  // your woopra domain (required)
  domain: '',
  // whether to track a pageview on load
  initialPageview: true
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Woopra.prototype.initialize = function (options, ready) {
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
  window.woopra.config({ domain: options.domain });
  if (options.initialPageview) this.pageview();
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Woopra.prototype.identify = function (id, traits, options) {
  if (id) traits.id = id;
  window.woopra.identify(traits).push(); // `push` sends it off async
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Woopra.prototype.track = function (event, properties, options) {
  window.woopra.track(event, properties);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Woopra.prototype.pageview = function (url) {
  window.woopra.track('pv', {
    url: url || window.location.pathname,
    title: document.title
  });
};
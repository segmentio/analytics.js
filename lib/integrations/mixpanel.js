
var alias = require('alias')
  , clone = require('clone')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Mixpanel` integration.
 */

var Mixpanel = module.exports = integration('Mixpanel');


/**
 * Required key.
 */

Mixpanel.prototype.key = 'token';


/**
 * Default options.
 */

Mixpanel.prototype.defaults = {
  // a custom cookie name to use
  cookieName: '',
  // whether to track an initial pageview on initialize
  initialPageview: false,
  // whether to call `mixpanel.name_tag` on `identify` calls
  nameTag: true,
  // your mixpanel token (required)
  token: '',
  // whether to track `pageview` calls to mixpanel as "Loaded a Page" events
  pageview: false,
  // whether to use mixpanel's "people" api
  people: false
};


/**
 * Initialize.
 *
 * https://mixpanel.com/help/reference/javascript#installing
 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.init
 *
 * @param {Object} options
 * @param {Function} ready
 */

Mixpanel.prototype.initialize = function (options, ready) {
  (function (c, a) {
    window.mixpanel = a;
    var b, d, h, e;
    a._i = [];
    a.init = function (b, c, f) {
      function d(a, b) {
        var c = b.split('.');
        2 == c.length && (a = a[c[0]], b = c[1]);
        a[b] = function () {
          a.push([b].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }
      var g = a;
      'undefined' !== typeof f ? g = a[f] = [] : f = 'mixpanel';
      g.people = g.people || [];
      h = ['disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'alias', 'name_tag', 'set_config', 'people.set', 'people.increment', 'people.track_charge', 'people.append'];
      for (e = 0; e < h.length; e++) d(g, h[e]);
      a._i.push([b, c, f]);
    };
    a.__SV = 1.2;
    load('//cdn.mxpnl.com/libs/mixpanel-2.2.min.js', ready);
  })(document, window.mixpanel || []);

  var cloned = clone(options);
  alias(cloned, { cookieName: 'cookie_name' });
  window.mixpanel.init(options.token, cloned);

  if (options.initialPageview) this.pageview();
};


/**
 * Identify.
 *
 * https://mixpanel.com/help/reference/javascript#super-properties
 * https://mixpanel.com/help/reference/javascript#user-identity
 * https://mixpanel.com/help/reference/javascript#storing-user-profiles
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Mixpanel.prototype.identify = function (id, traits, options) {
  var mp = window.mixpanel;

  // id
  if (id) mp.identify(id);

  // name tag
  var nametag = traits.email || traits.username || id;
  if (nametag) mp.name_tag(nametag);

  // traits
  alias(traits, {
    created: '$created',
    email: '$email',
    firstName: '$first_name',
    lastName: '$last_name',
    lastSeen: '$last_seen',
    name: '$name',
    username: '$username',
    phone: '$phone'
  });
  mp.register(traits);
  if (this.options.people) mp.people.set(traits);
};


/**
 * Track.
 *
 * https://mixpanel.com/help/reference/javascript#sending-events
 * https://mixpanel.com/help/reference/javascript#tracking-revenue
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Mixpanel.prototype.track = function (event, properties, options) {
  var mp = window.mixpanel;
  mp.track(event, properties);
  if (properties.revenue && this.options.people) {
    mp.people.track_charge(properties.revenue);
  }
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Mixpanel.prototype.pageview = function (url) {
  if (!this.options.pageview) return;

  this.track('Loaded a Page', {
    url: url || document.location.href,
    name: document.title
  });
};


/**
 * Alias.
 *
 * https://mixpanel.com/help/reference/javascript#user-identity
 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.alias
 *
 * @param {String} newId
 * @param {String} oldId (optional)
 */

Mixpanel.prototype.alias = function (newId, oldId) {
  var mp = window.mixpanel;
  if (mp.get_distinct_id && mp.get_distinct_id() === newId) return;

  // HACK: internal mixpanel API to ensure we don't overwrite
  if (mp.get_property && mp.get_property('$people_distinct_id') === newId) return;

  // although undocumented, mixpanel takes an optional original id
  mp.alias(newId, oldId);
};
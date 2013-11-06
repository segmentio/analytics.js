
var alias = require('alias');
var clone = require('clone');
var integration = require('integration');
var load = require('load-script');


/**
 * Expose `Mixpanel`.
 */

var Mixpanel = module.exports = integration('Mixpanel')
  .assumesPageview()
  .readyOnLoad()
  .global('mixpanel')
  .option('cookieName', '')
  .option('nameTag', true)
  .option('pageview', false)
  .option('people', false)
  .option('token', '')
  .option('trackAllPages', false)
  .option('trackNamedPages', true);


/**
 * Options aliases.
 */

var optionsAliases = {
  cookieName: 'cookie_name'
};


/**
 * Initialize.
 *
 * https://mixpanel.com/help/reference/javascript#installing
 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.init
 */

Mixpanel.prototype.initialize = function () {
  (function (c, a) {window.mixpanel = a; var b, d, h, e; a._i = []; a.init = function (b, c, f) {function d(a, b) {var c = b.split('.'); 2 == c.length && (a = a[c[0]], b = c[1]); a[b] = function () {a.push([b].concat(Array.prototype.slice.call(arguments, 0))); }; } var g = a; 'undefined' !== typeof f ? g = a[f] = [] : f = 'mixpanel'; g.people = g.people || []; h = ['disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'alias', 'name_tag', 'set_config', 'people.set', 'people.increment', 'people.track_charge', 'people.append']; for (e = 0; e < h.length; e++) d(g, h[e]); a._i.push([b, c, f]); }; a.__SV = 1.2; })(document, window.mixpanel || []);
  var options = alias(this.options, optionsAliases);
  window.mixpanel.init(options.token, options);
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Mixpanel.prototype.load = function (callback) {
  load('//cdn.mxpnl.com/libs/mixpanel-2.2.min.js', callback);
};


/**
 * Trait aliases.
 */

var traitAliases = {
  created: '$created',
  email: '$email',
  firstName: '$first_name',
  lastName: '$last_name',
  lastSeen: '$last_seen',
  name: '$name',
  username: '$username',
  phone: '$phone'
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
  traits = traits || {};

  // id
  if (id) window.mixpanel.identify(id);

  // name tag
  var nametag = traits.email || traits.username || id;
  if (nametag) window.mixpanel.name_tag(nametag);

  // traits
  traits = alias(traits, traitAliases);
  window.mixpanel.register(traits);
  if (this.options.people) window.mixpanel.people.set(traits);
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
  properties = properties || {};
  window.mixpanel.track(event, properties);
  if (properties.revenue && this.options.people) {
    window.mixpanel.people.track_charge(properties.revenue);
  }
};


/**
 * Page.
 *
 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.track_pageview
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Mixpanel.prototype.page = function (name, properties, options) {
  var all = this.options.trackAllPages;
  var named = this.options.trackNamedPages;
  if (named && name) this.track('Viewed ' + name + ' Page', properties);
  if (all) this.track('Loaded a Page', properties);
};


/**
 * Alias.
 *
 * https://mixpanel.com/help/reference/javascript#user-identity
 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.alias
 *
 * @param {String} to
 * @param {String} from (optional)
 */

Mixpanel.prototype.alias = function (to, from) {
  var mp = window.mixpanel;
  if (mp.get_distinct_id && mp.get_distinct_id() === to) return;
  // HACK: internal mixpanel API to ensure we don't overwrite
  if (mp.get_property && mp.get_property('$people_distinct_id') === to) return;
  // although undocumented, mixpanel takes an optional original id
  mp.alias(to, from);
};
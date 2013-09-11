
var extend = require('extend')
  , integration = require('../integration')
  , load = require('load-script')
  , user = require('../user');


/**
 * Expose `Clicky` integration.
 *
 * http://clicky.com/help/customization
 */

var Clicky = module.exports = integration('Clicky');


/**
 * Required key.
 */

Clicky.prototype.key = 'siteId';


/**
 * Default options.
 */

Clicky.prototype.defaults = {
  siteId: null
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Clicky.prototype.initialize = function (options, ready) {
  window.clicky_site_ids || (window.clicky_site_ids = []);
  window.clicky_site_ids.push(options.siteId);
  this.identify(user.id(), user.traits());
  load('//static.getclicky.com/js', ready);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Clicky.prototype.identify = function (id, traits, options) {
  window.clicky_custom || (window.clicky_custom = {});
  window.clicky_custom.session || (window.clicky_custom.session = {});
  if (id) traits.id = id;
  extend(window.clicky_custom.session, traits);
};


/**
 * Track.
 *
 * http://clicky.com/help/customization#/help/custom/manual
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Clicky.prototype.track = function (event, properties, options) {
  properties || (properties = {});
  window.clicky.goal(event, properties.revenue);
};


/**
 * Pageview.
 *
 * http://clicky.com/help/customization#/help/custom/manual
 *
 * @param {String} url (optional)
 */

Clicky.prototype.pageview = function (url) {
  url || (url = window.location.pathname);
  this._path = url;
  window.clicky.log(url, document.title);
};
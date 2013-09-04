
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
  window.clicky_site_ids = window.clicky_site_ids || [];
  window.clicky_site_ids.push(options.siteId);
  window.clicky_custom = {};

  var session = {};
  extend(session, user.traits());
  if (user.id()) session.id = user.id();
  window.clicky_custom.session = session;

  load('//static.getclicky.com/js', ready);
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
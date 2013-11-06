
var alias = require('alias');
var each = require('each');
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `Evergage` integration.
 */

var Evergage = module.exports = integration('Evergage');


/**
 * Default options.
 */

Evergage.prototype.defaults = {
  // your Evergage account name as seen in accountName.evergage.com (required)
  account: null,
  // your Evergage dataset ID, not dataset label (required)
  dataset: null
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Evergage.prototype.initialize = function (options, ready) {
  var account = options.account;
  var dataset = options.dataset;

  window._aaq = window._aaq || [];
  push('setEvergageAccount', account);
  push('setDataset', dataset);
  push('setUseSiteConfig', true);
  ready();

  load('//cdn.evergage.com/beacon/' + account + '/' + dataset + '/scripts/evergage.min.js');
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Evergage.prototype.identify = function (id, traits, options) {
  if (!id) return;
  push('setUser', id);

  alias(traits, {
    name: 'userName',
    email: 'userEmail'
  });

  each(traits, function (key, value) {
    push('setUserField', key, value, 'page');
  });
};


/**
 * Group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Evergage.prototype.group = function (id, properties, options) {
  if (!id) return;
  push('setCompany', id);
  each(properties, function(key, value) {
    push('setAccountField', key, value, 'page');
  });
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Evergage.prototype.track = function (event, properties, options) {
  push('trackAction', event, properties);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Evergage.prototype.pageview = function (url) {
  window.Evergage.init(true);
};


/**
 * Helper to push onto the Evergage queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._aaq.push(args);
}
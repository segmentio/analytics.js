
var alias = require('alias');
var each = require('each');
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_aaq');


/**
 * Expose `Evergage` integration.
 */

var Evergage = module.exports = integration('Evergage')
  .assumesPageview()
  .readyOnInitialize()
  .global('_aaq')
  .option('account', '')
  .option('dataset', '');


/**
 * Initialize.
 *
 * @param {Object} page
 */

Evergage.prototype.initialize = function (options) {
  var account = this.options.account;
  var dataset = this.options.dataset;

  window._aaq = [];
  push('setEvergageAccount', account);
  push('setDataset', dataset);
  push('setUseSiteConfig', true);

  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Evergage.prototype.load = function (callback) {
  var account = this.options.account;
  var dataset = this.options.dataset;
  var url = '//cdn.evergage.com/beacon/' + account + '/' + dataset + '/scripts/evergage.min.js';
  load(url, callback);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Evergage.prototype.page = function (name, properties, options) {
  window.Evergage.init(true);
};


/**
 * Trait aliases.
 */

var traitAliases = {
  name: 'userName',
  email: 'userEmail'
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

  traits = traits || {};
  traits = alias(traits, traitAliases);
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
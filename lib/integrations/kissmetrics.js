
var alias = require('alias');
var Batch = require('batch');
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_kmq');


/**
 * Expose `KISSmetrics`.
 */

var KISSmetrics = module.exports = integration('KISSmetrics')
  .assumesPageview()
  .readyOnInitialize()
  .global('_kmq')
  .global('KM')
  .global('_kmil')
  .option('apiKey', '')
  .option('trackNamedPages', true);


/**
 * Initialize.
 *
 * http://support.kissmetrics.com/apis/javascript
 */

KISSmetrics.prototype.initialize = function () {
  window._kmq = [];
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

KISSmetrics.prototype.load = function (callback) {
  var key = this.options.apiKey;
  var useless = '//i.kissmetrics.com/i.js';
  var library = '//doug1izaerwt3.cloudfront.net/' + key + '.1.js';

  new Batch()
    .push(function (done) { load(useless, done); }) // :)
    .push(function (done) { load(library, done); })
    .end(callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

KISSmetrics.prototype.identify = function (id, traits, options) {
  traits = traits || {};
  if (id) push('identify', id);
  if (traits) push('set', traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

KISSmetrics.prototype.track = function (event, properties, options) {
  properties = properties || {};
  properties = alias(properties, { revenue: 'Billing Amount' });
  push('record', event, properties);
};


/**
 * Alias.
 *
 * @param {String} to
 * @param {String} from (optional)
 */

KISSmetrics.prototype.alias = function (to, from) {
  push('alias', to, from);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

KISSmetrics.prototype.page = function (name, properties, options) {
  properties = properties || {};
  if (!this.options.trackNamedPages || !name) return;
  this.track('Viewed ' + name + ' Page', properties);
};
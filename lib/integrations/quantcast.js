
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_qevents', { wrap: false });
var user = require('../user');


/**
 * Expose `Quantcast`.
 */

var Quantcast = module.exports = integration('Quantcast')
  .assumesPageview()
  .readyOnInitialize()
  .global('_qevents')
  .global('__qc')
  .option('pCode', null);


/**
 * Initialize.
 *
 * https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/
 * https://www.quantcast.com/help/cross-platform-audience-measurement-guide/
 *
 * @param {Object} page (optional)
 */

Quantcast.prototype.initialize = function (page) {
  page = page || {};
  push({
    qacct: this.options.pCode,
    uid: user.id(),
    labels: page.name
  });
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Quantcast.prototype.load = function (callback) {
  load({
    http: 'http://edge.quantserve.com/quant.js',
    https: 'https://secure.quantserve.com/quant.js'
  }, callback);
};


/**
 * Page.
 *
 * https://cloudup.com/cBRRFAfq6mf
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Quantcast.prototype.page = function (name, properties, options) {
  push({
    event: 'refresh',
    qacct: this.options.pCode,
    uid: user.id(),
    labels: name
  });
};


/**
 * Identify.
 *
 * https://www.quantcast.com/help/cross-platform-audience-measurement-guide/
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Quantcast.prototype.identify = function (id, traits, options) {
  // edit the initial quantcast settings
  if (id) window._qevents[0].uid = id;
};


/**
 * Track.
 *
 * https://cloudup.com/cBRRFAfq6mf
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Quantcast.prototype.track = function (event, properties, options) {
  push({
    event: 'click',
    qacct: this.options.pCode,
    uid: user.id(),
    labels: event
  });
};
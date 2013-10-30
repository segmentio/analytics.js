
var alias = require('alias');
var callback = require('callback');
var integration = require('integration');
var load = require('load-script-once');


/**
 * Expose `Improvely`.
 */

var Improvely = module.exports = integration('Improvely')
  .assumesPageview()
  .readyOnInitialize()
  .option('domain', '')
  .option('projectId', null);


/**
 * Exists?
 */

Heap.prototype.exists = function () {
  return !! window._improvely || window.improvely;
};


/**
 * Initialize.
 *
 * http://www.improvely.com/docs/landing-page-code
 */

Improvely.prototype.initialize = function () {
  window._improvely = [];
  window.improvely = {init: function (e, t) { window._improvely.push(["init", e, t]); }, goal: function (e) { window._improvely.push(["goal", e]); }, label: function (e) { window._improvely.push(["label", e]); } };

  var domain = this.options.domain;
  var id = this.options.projectId;
  window.improvely.init(domain, id);
  this.load();
};


/**
 * Load the Improvely library.
 *
 * @param {Function} callback
 */

Improvely.prototype.load = function (callback) {
  var domain = this.options.domain;
  load('//' + domain + '.iljmp.com/improvely.js', callback);
};


/**
 * Identify.
 *
 * http://www.improvely.com/docs/labeling-visitors
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Improvely.prototype.identify = function (id, traits, options) {
  if (id) window.improvely.label(id);
};


/**
 * Track.
 *
 * http://www.improvely.com/docs/conversion-code
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Improvely.prototype.track = function (event, properties, options) {
  properties.type = event;
  properties = alias(properties, { revenue: 'amount' });
  window.improvely.goal(properties);
};
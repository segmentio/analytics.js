
var alias = require('alias')
  , callback = require('callback')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Improvely` integration.
 */

var Improvely = module.exports = integration('Improvely');


/**
 * Default options.
 */

Improvely.prototype.defaults = {
  // your improvely domain (required)
  domain: '',
  // your improvely project id (required)
  projectId: null
};


/**
 * Initialize.
 *
 * http://www.improvely.com/docs/landing-page-code
 *
 * @param {Object} options
 * @param {Function} ready
 */

Improvely.prototype.initialize = function (options, ready) {
  window._improvely = window._improvely || [];
  window.improvely = window.improvely || {
    init: function (e, t) { window._improvely.push(["init", e, t]); },
    goal: function (e) { window._improvely.push(["goal", e]); },
    label: function (e) { window._improvely.push(["label", e]); }
  };
  window.improvely.init(options.domain, options.projectId);
  callback.async(ready);

  load('//' + options.domain + '.iljmp.com/improvely.js');
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
  alias(properties, { 'revenue' : 'amount' }); // improvely calls it `amount`
  window.improvely.goal(properties);
};
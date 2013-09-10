
var alias = require('alias')
  , convertDates = require('convert-dates')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Preact` integration.
 *
 * http://www.preact.io/api/javascript
 */

var Preact = module.exports = integration('Preact');


/**
 * Required key.
 */

Preact.prototype.key = 'projectCode';


/**
 * Default options.
 */

Preact.prototype.defaults = {
  // your preact project code (required)
  projectCode: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Preact.prototype.initialize = function (options, ready) {
  window._lnq || (window._lnq = []);
  window._lnq.push(["_setCode", options.projectCode]);
  ready();
  load('//d2bbvl6dq48fa6.cloudfront.net/js/ln-2.4.min.js');
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Preact.prototype.identify = function (id, traits, options) {
  if (!id) return;
  convertDates(traits, convertDate);
  alias(traits, { created: 'created_at' });

  window._lnq.push(['_setPersonData', {
    name: traits.name,
    email: traits.email,
    uid: id,
    properties: traits
  }]);
};


/**
 * Group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Preact.prototype.group = function (id, properties, options) {
  if (!id) return;
  properties.id = id;
  window._lnq.push(['_setAccount', properties]);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Preact.prototype.track = function (event, properties, options) {
  var special = {};
  special.name = event;
  if (properties.revenue) {
    special.revenue = properties.revenue * 100;
    delete properties.revenue;
  }
  if (properties.note) {
    special.note = properties.note;
    delete properties.note;
  }

  window._lnq.push(['_logEvent', special, properties]);
};


/**
 * Convert a `date` to a format Preact supports.
 *
 * @param {Date} date
 * @return {Number}
 */

function convertDate (date) {
  return Math.floor(date / 1000);
}
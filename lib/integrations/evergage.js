
var load     = require('load-script')
  , integration = require('../integration')
  , each     = require('each');


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
  dataset: null,
  // use the minified version of the javascript
  minified: true,
  // the Evergage logging level to set for console logging
  // http://support.evergage.com/entries/24980323-Adjusting-Console-Log-Details
  loggingLevel: 'NONE'
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Evergage.prototype.initialize = function (options, ready) {
  window._aaq = window._aaq || [];
  window._aaq.push(['setEvergageAccount', options.account], ['setDataset', options.dataset], ['setUseSiteConfig', true]);
  if (options.loggingLevel != null) {
    window._aaq.push(['setLoggingLevel', options.loggingLevel]);
  }

  var evergageBeaconFileName = options.minified ? 'evergage.min.js' : 'evergage.js';
  load('//cdn.evergage.com/beacon/' + options.account + '/' + options.dataset + '/scripts/' + evergageBeaconFileName);

  // Evergage uses a queue array, so it is ready immediatelly
  ready();
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Evergage.prototype.identify = function (id, traits, options) {
  if (!id) return; // Evergage requires an id
  window._aaq.push(['setUser', id]);
  each(traits, function(name, value) {
    if (name == 'name') {
      window._aaq.push(['setUserField', 'userName', value, 'page']);
    } else if (name == 'email') {
      window._aaq.push(['setUserField', 'userEmail', value, 'page']);
    } else {
      window._aaq.push(['setUserField', name, value, 'page']);
    }
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
  if (!id) return; // Evergage requires group ID
  window._aaq.push(['setCompany', id]);
  each(properties, function(name, value) {
    window._aaq.push(['setAccountField', name, value, 'page']);
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
  window._aaq.push(['trackAction', event, properties]);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Evergage.prototype.pageview = function (url) {
  window.Evergage.init(true);
};


var callback = require('callback')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `FoxMetrics` integration.
 *
 * http://foxmetrics.com/documentation/apijavascript
 */

var FoxMetrics = module.exports = integration('FoxMetrics');


/**
 * Required key.
 */

FoxMetrics.prototype.key = 'appId';


/**
 * Default options.
 */

FoxMetrics.prototype.defaults = {
  // your foxmetrics app id (required)
  appId: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

FoxMetrics.prototype.initialize = function (options, ready) {
  var _fxm = window._fxm || {};
  window._fxm = _fxm.events || [];
  callback.async(ready);
  load('//d35tca7vmefkrc.cloudfront.net/scripts/' + options.appId + '.js');
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

FoxMetrics.prototype.identify = function (id, traits, options) {
  if (!id) return; // foxmetrics requires an `id`

  // foxmetrics needs the first and last name separately
  var firstName = traits.firstName;
  var lastName = traits.lastName;
  if (!firstName && traits.name) firstName = traits.name.split(' ')[0];
  if (!lastName && traits.name) lastName = traits.name.split(' ')[1];

  window._fxm.push([
    '_fxm.visitor.profile',
    id,             // user id
    firstName,      // first name
    lastName,       // last name
    traits.email,   // email
    traits.address, // address
    undefined,      // social
    undefined,      // partners
    traits          // attributes
  ]);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

FoxMetrics.prototype.track = function (event, properties, options) {
  window._fxm.push([
    event,               // event name
    properties.category, // category
    properties           // properties
  ]);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

FoxMetrics.prototype.pageview = function (url) {
  window._fxm.push([
    '_fxm.pages.view',
    undefined, // title
    undefined, // name
    undefined, // category
    url,       // url
    undefined  // referrer
  ]);
};
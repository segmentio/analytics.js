
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_fxm');


/**
 * Expose `FoxMetrics`.
 */

var FoxMetrics = module.exports = integration('FoxMetrics')
  .assumesPageview()
  .readyOnInitialize()
  .global('_fxm')
  .option('appId', '');


/**
 * Initialize.
 *
 * http://foxmetrics.com/documentation/apijavascript
 *
 * @param {Object} page
 */

FoxMetrics.prototype.initialize = function () {
  window._fxm = [];
  this.load();
};


/**
 * Load the FoxMetrics library.
 *
 * @param {Function} callback
 */

FoxMetrics.prototype.load = function (callback) {
  var id = this.options.appId;
  load('//d35tca7vmefkrc.cloudfront.net/scripts/' + id + '.js', callback);
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
  // TODO: remove when we have facade
  traits = traits || {};
  var firstName = traits.firstName;
  var lastName = traits.lastName;
  if (!firstName && traits.name) firstName = traits.name.split(' ')[0];
  if (!lastName && traits.name) lastName = traits.name.split(' ')[1];

  push(
    '_fxm.visitor.profile',
    id,             // user id
    firstName,      // first name
    lastName,       // last name
    traits.email,   // email
    traits.address, // address
    undefined,      // social
    undefined,      // partners
    traits          // attributes
  );
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

FoxMetrics.prototype.track = function (event, properties, options) {
  properties = properties || {};
  push(
    event,               // event name
    properties.category, // category
    properties           // properties
  );
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

FoxMetrics.prototype.page = function (name, properties, options) {
  properties = properties || {};
  push(
    '_fxm.pages.view',
    properties.title,   // title
    name,               // name
    undefined,          // category
    properties.url,     // url
    properties.referrer // referrer
  );
};

var callback = require('callback')
  , integration = require('../integration')
  , load = require('load-script')
  , onBody = require('on-body')
  , user = require('../user');


/**
 * Expose `GoSquared` integration.
 *
 * http://www.gosquared.com/support
 */

var GoSquared = module.exports = integration('GoSquared')
  .option('siteToken', '');


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

GoSquared.prototype.initialize = function (options, ready) {
  // gosquared assumes a body in their script, so we need this wrapper
  var self = this;
  onBody(function () {
    window.GoSquared = {};
    window.GoSquared.acct = options.siteToken;
    window.GoSquared.q = [];
    window._gstc_lt = new Date().getTime(); // time from `load`

    // identify since gosquared doesn't have an async identify api
    self.identify(user.id(), user.traits());

    callback.async(self.ready);
    self.load();
  });
};


/**
 * Load the GoSquared library.
 *
 * @param {Function} callback
 */

GoSquared.prototype.load = function (callback) {
  load('//d1l6p2sc9645hc.cloudfront.net/tracker.js', callback);
};


/**
 * Identify.
 *
 * https://www.gosquared.com/customer/portal/articles/612063-tracker-functions
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

GoSquared.prototype.identify = function (id, traits, options) {
  window.GoSquared.UserName = id;
  window.GoSquared.VisitorName = traits.email || traits.username || id;
  if (id) traits.userID = id; // gosquared recognizes this in `Visitor`
  window.GoSquared.Visitor = traits;
};


/**
 * Track.
 *
 * https://www.gosquared.com/customer/portal/articles/609683-event-tracking
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GoSquared.prototype.track = function (event, properties, options) {
  push('TrackEvent', event, properties);
};


/**
 * Page.
 *
 * https://www.gosquared.com/customer/portal/articles/612063-tracker-functions
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GoSquared.prototype.page = function (name, properties, options) {
  push('TrackView', properties.path, name || properties.title);
};


/**
 * Helper to push onto the GoSquared queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window.GoSquared.q.push(args);
}
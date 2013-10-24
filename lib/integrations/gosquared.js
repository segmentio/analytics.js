
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');
var onBody = require('on-body');
var user = require('../user');


/**
 * Expose `GoSquared`.
 */

var GoSquared = module.exports = integration('GoSquared')
  .option('siteToken', '');


/**
 * Initialize.
 *
 * http://www.gosquared.com/support
 */

GoSquared.prototype.initialize = function () {
  var self = this;
  var options = this.options;

  // gosquared assumes a body in their script, so we need this wrapper
  onBody(function () {
    window.GoSquared = {};
    window.GoSquared.acct = options.siteToken;
    window.GoSquared.q = [];
    window._gstc_lt = new Date().getTime(); // time from `load`

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
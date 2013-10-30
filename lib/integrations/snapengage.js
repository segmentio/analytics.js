
var integration = require('integration');
var load = require('load-script-once');


/**
 * Expose `SnapEngage`.
 */

var SnapEngage = module.exports = integration('SnapEngage')
  .assumesPageview()
  .readyOnLoad()
  .option('apiKey', '');


/**
 * Exists?
 */

SnapEngage.prototype.exists = function () {
  return !! window.SnapABug;
};


/**
 * Initialize.
 *
 * http://help.snapengage.com/installation-guide-getting-started-in-a-snap/
 */

SnapEngage.prototype.initialize = function () {
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

SnapEngage.prototype.load = function (callback) {
  var key = this.options.apiKey;
  var url = '//commondatastorage.googleapis.com/code.snapengage.com/js/' + key + '.js';
  load(url, callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

SnapEngage.prototype.identify = function (id, traits, options) {
  if (!traits.email) return;
  window.SnapABug.setUserEmail(traits.email);
};
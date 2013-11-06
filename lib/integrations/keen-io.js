
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');


/**
 * Expose `Keen IO`.
 */

var Keen = module.exports = integration('Keen IO')
  .readyOnInitialize()
  .global('Keen')
  .option('projectId', '')
  .option('readKey', '')
  .option('writeKey', '')
  .option('trackNamedPages', true)
  .option('trackAllPages', false);


/**
 * Initialize.
 *
 * https://keen.io/docs/
 */

Keen.prototype.initialize = function () {
  var options = this.options;
  window.Keen = window.Keen||{configure:function(e){this._cf=e;},addEvent:function(e,t,n,i){this._eq=this._eq||[],this._eq.push([e,t,n,i]);},setGlobalProperties:function(e){this._gp=e;},onChartsReady:function(e){this._ocrq=this._ocrq||[],this._ocrq.push(e);}};
  window.Keen.configure({
    projectId: options.projectId,
    writeKey: options.writeKey,
    readKey: options.readKey
  });
  this.load();
};


/**
 * Load the Keen IO library.
 *
 * @param {Function} callback
 */

Keen.prototype.load = function (callback) {
  load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js', callback);
};


/**
 * Identify.
 *
 * TODO: migrate from old `userId` to simpler `id`
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Keen.prototype.identify = function (id, traits, options) {
  traits = traits || {};
  var user = {};
  if (id) user.userId = id;
  if (traits) user.traits = traits;
  window.Keen.setGlobalProperties(function() {
    return { user: user };
  });
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Keen.prototype.track = function (event, properties, options) {
  window.Keen.addEvent(event, properties);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Keen.prototype.page = function (name, properties, options) {
  var opts = this.options;

  // named pages
  if (opts.trackNamedPages && name) this.track('Viewed ' + name + ' Page', properties);

  // all pages
  if (opts.trackAllPages) this.track('Loaded a Page', properties);
};
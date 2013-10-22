
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `Keen IO` integration.
 *
 * https://keen.io/docs/
 */

var Keen = module.exports = integration('Keen IO');


/**
 * Default options.
 */

Keen.prototype.defaults = {
  // whether to send name `page` calls to keen io
  page: false,
  // whether to send all pageviews (named and unnamed) to keen io
  pageviews: false,
  // your keen io project id (required)
  projectId: '',
  // your keen io read key
  readKey: '',
  // your keen io write key (required)
  writeKey: ''
};


/**
 * Load the Keen IO library.
 */

Keen.prototype.load = function () {
  load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js');
};


/**
 * Initialize.
 *
 * @param {Object} options
 */

Keen.prototype.initialize = function (options) {
  window.Keen = window.Keen||{configure:function(e){this._cf=e},addEvent:function(e,t,n,i){this._eq=this._eq||[],this._eq.push([e,t,n,i])},setGlobalProperties:function(e){this._gp=e},onChartsReady:function(e){this._ocrq=this._ocrq||[],this._ocrq.push(e)}};
  window.Keen.configure({
    projectId: options.projectId,
    writeKey: options.writeKey,
    readKey: options.readKey
  });
  callback.async(this.ready);
  this.load();
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
  if (!this.options.page) return;

  // named pages
  if (name) this.track('Viewed ' + name + ' Page', properties);

  // all pages
  if (this.options.pageviews) this.track('Loaded a Page', properties);
};
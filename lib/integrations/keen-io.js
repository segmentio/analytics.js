
var callback = require('callback')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Keen IO` integration.
 */

var Keen = module.exports = integration('Keen IO');


/**
 * Default options.
 */

Keen.prototype.defaults = {
  // whether or not to track an initial pageview on `initialize`
  initialPageview: false,
  // whether or not to send `pageview` calls on to keen io
  pageview: false,
  // your keen io project id (required)
  projectId: '',
  // your keen io read key
  readKey: '',
  // your keen io write key (required)
  writeKey: ''
};


/**
 * Initialize.
 *
 * https://keen.io/docs/
 *
 * @param {Object} options
 * @param {Function} ready
 */

Keen.prototype.initialize = function (options, ready) {
  window.Keen = window.Keen||{configure:function(e){this._cf=e},addEvent:function(e,t,n,i){this._eq=this._eq||[],this._eq.push([e,t,n,i])},setGlobalProperties:function(e){this._gp=e},onChartsReady:function(e){this._ocrq=this._ocrq||[],this._ocrq.push(e)}};
  window.Keen.configure({
    projectId: options.projectId,
    writeKey: options.writeKey,
    readKey: options.readKey
  });
  callback.async(ready);

  if (options.initialPageview) this.pageview();
  load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js');
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
 * Pageview.
 *
 * @param {String} url (optional)
 */

Keen.prototype.pageview = function (url) {
  if (!this.options.pageview) return;
  var properties = {
    url: url || document.location.href,
    name: document.title
  };
  this.track('Loaded a Page', properties);
};
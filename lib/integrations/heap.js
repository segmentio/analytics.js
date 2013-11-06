
var alias = require('alias');
var callback = require('callback');
var integration = require('integration');
var load = require('load-script');


/**
 * Expose `Heap`.
 */

var Heap = module.exports = integration('Heap')
  .assumesPageview()
  .readyOnInitialize()
  .global('heap')
  .global('_heapid')
  .option('apiKey', '');


/**
 * Initialize.
 *
 * https://heapanalytics.com/docs#installWeb
 *
 * @param {Object} page
 */

Heap.prototype.initialize = function (page) {
  window.heap=window.heap||[];window.heap.load=function(a){window._heapid=a;var d=function(a){return function(){window.heap.push([a].concat(Array.prototype.slice.call(arguments,0)));};},e=["identify","track"];for(var f=0;f<e.length;f++);window.heap[e[f]]=d(e[f]);};
  window.heap.load(this.options.apiKey);
  this.load();
};


/**
 * Load the Heap library.
 *
 * @param {Function} callback
 */

Heap.prototype.load = function (callback) {
  load('//d36lvucg9kzous.cloudfront.net', callback);
};


/**
 * Trait aliases.
 */

var traitAliases = {
  username: 'handle'
};


/**
 * Identify.
 *
 * https://heapanalytics.com/docs#identify
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Heap.prototype.identify = function (id, traits, options) {
  traits = alias(traits, traitAliases);
  window.heap.identify(traits);
};


/**
 * Track.
 *
 * https://heapanalytics.com/docs#track
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Heap.prototype.track = function (event, properties, options) {
  window.heap.track(event, properties);
};

var alias = require('alias')
  , callback = require('callback')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Heap` integration.
 *
 * https://heapanalytics.com/docs
 */

var Heap = module.exports = integration('Heap');


/**
 * Required key.
 */

Heap.prototype.key = 'apiKey';


/**
 * Default options.
 */

Heap.prototype.defaults = {
  // your heap api key (required)
  apiKey: '',
};


/**
 * Initialize.
 *
 * https://heapanalytics.com/docs#installWeb
 *
 * @param {Object} options
 * @param {Function} ready
 */

Heap.prototype.initialize = function (options, ready) {
  window.heap=window.heap||[];window.heap.load=function(a){window._heapid=a;var b=document.createElement("script");b.type="text/javascript",b.async=!0,b.src=("https:"===document.location.protocol?"https:":"http:")+"//d36lvucg9kzous.cloudfront.net";var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c);var d=function(a){return function(){heap.push([a].concat(Array.prototype.slice.call(arguments,0)))}},e=["identify","track"];for(var f=0;f<e.length;f++)heap[e[f]]=d(e[f])};
  window.heap.load(options.apiKey);
  callback.async(ready);
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
  alias(traits, { username: 'handle' });
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
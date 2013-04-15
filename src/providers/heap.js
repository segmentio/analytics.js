// https://heapanalytics.com/docs

var Provider = require('../provider')
  , load     = require('load-script');

module.exports = Provider.extend({

  name : 'Heap',

  key : 'apiKey',

  defaults : {
    apiKey : null
  },

  initialize : function (options, ready) {
    window.heap=window.heap||[];window.heap.load=function(a){window._heapid=a;var b=document.createElement("script");b.type="text/javascript",b.async=!0,b.src=("https:"===document.location.protocol?"https:":"http:")+"//d36lvucg9kzous.cloudfront.net";var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c);var d=function(a){return function(){heap.push([a].concat(Array.prototype.slice.call(arguments,0)))}},e=["identify","track"];for(var f=0;f<e.length;f++)heap[e[f]]=d(e[f])};
    window.heap.load(options.apiKey);

    // heap creates its own queue, so we're ready right away
    ready();
  },

  identify : function (userId, traits) {
    window.heap.identify(traits);
  },

  track : function (event, properties) {
    window.heap.track(event, properties);
  }

});
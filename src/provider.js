var extend = require('extend')
  , type   = require('type');


module.exports = Provider;


function Provider (options) {
  // Allow for `options` to only be a string if the provider has specified
  // a default `key`, in which case convert `options` into a dictionary.
  if (type(options) === 'string' && this.key) {
    var key = options;
    options = {};
    options[this.key] = key;
  } else {
    throw new Error('Could not resolve options.');
  }

  // Extend the options passed in with the provider's defaults.
  extend(this.options, options);

  // Call the provider's initialize object.
  this.initialize.call(this, this.options);
}


// Helper to add provider methods to the prototype chain, for adding custom
// providers. Modeled after [Backbone's `extend` method](https://github.com/documentcloud/backbone/blob/master/backbone.js#L1464).
Provider.extend = function (name, provider) {
  var parent = this;
  var child = function () { return parent.apply(this, arguments); };
  var Surrogate = function () { this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();
  extend(child.prototype, provider);
  return child;
};


// Add some defaults to the `Provider` prototype.
extend(Provider.prototype, {

  // Override this with any default options.
  options : {},

  // Override this if our provider only needs a single API key to
  // initialize itself, in which case we can use the terse initialization
  // syntax:
  //
  //     analytics.initialize({
  //       'Provider' : 'XXXXXXX'
  //     });
  //
  key : undefined,

  // Override to provider your own initialization logic, usually a snippet
  // and loading a Javascript library.
  initialize : function (options) {}
});
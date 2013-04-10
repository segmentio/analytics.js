var each   = require('each')
  , extend = require('extend')
  , type   = require('type');


module.exports = Provider;


/**
 * Provider
 *
 * @param {Object} options - settings to initialize the Provider with. This will
 * be merged with the Provider's own defaults.
 *
 * @param {Function} ready - a ready callback, to be called when the provider is
 * ready to handle analytics calls.
 */

function Provider (options, ready) {
  var self = this;

  // Make a queue of `{ method : 'identify', args : [] }` to unload once ready.
  this.queue = [];
  this.ready = false;

  // Allow for `options` to only be a string if the provider has specified
  // a default `key`, in which case convert `options` into a dictionary.
  if (type(options) !== 'object') {
    if (type(options) === 'string' && this.key) {
      var key = options;
      options = {};
      options[this.key] = key;
    } else {
      throw new Error('Couldnt resolve options.');
    }
  }

  // Extend the passed-in options with our defaults.
  this.options = extend({}, this.defaults, options);

  // Wrap our ready function, so that it ready from our internal queue first
  // and then marks us as ready.
  var dequeue = function () {
    each(self.queue, function (call) {
      var method = call.method
        , args   = call.args;
      self[method].apply(self, args);
    });
    self.ready = true;
    self.queue = [];
    ready();
  };

  // Call our initialize method.
  this.initialize.call(this, this.options, dequeue);
}


/**
 * Inheritance helper.
 *
 * Modeled after Backbone's `extend` method:
 * https://github.com/documentcloud/backbone/blob/master/backbone.js#L1464
 */

Provider.extend = function (properties) {
  var parent = this;
  var child = function () { return parent.apply(this, arguments); };
  var Surrogate = function () { this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();
  extend(child.prototype, properties);
  return child;
};


/**
 * Augment Provider's prototype.
 */

extend(Provider.prototype, {

  /**
   * Default settings for the provider.
   */

  options : {},


  /**
   * The single required API key for the provider. This lets us support a terse
   * initialization syntax:
   *
   *     analytics.initialize({
   *       'Provider' : 'XXXXXXX'
   *     });
   *
   * Only add this if the provider has a _single_ required key.
   */

  key : undefined,


  /**
   * Initialize our provider.
   *
   * @param {Object} options - the settings for the provider.
   * @param {Function} ready - a ready callback to call when we're ready to
   * start accept analytics method calls.
   */
  initialize : function (options, ready) {
    ready();
  },


  /**
   * Adds an item to the our internal pre-ready queue.
   *
   * @param {String} method - the analytics method to call (eg. 'track').
   * @param {Object} args - the arguments to pass to the method.
   */
  enqueue : function (method, args) {
    this.queue.push({
      method : method,
      args : args
    });
  }

});
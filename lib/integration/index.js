
var each = require('each')
  , extend = require('extend')
  , is = require('is')
  , protos = require('./protos')
  , statics = require('./statics');


/**
 * Expose `createIntegration`.
 */

module.exports = createIntegration;


/**
 * Create a new Integration constructor.
 *
 * @param {String} name
 */

function createIntegration (name) {

  /**
   * Initialize a new `Integration`.
   *
   * @param {Object} options
   * @param {Function} ready
   * @param {Object} analytics
   */

  function Integration (options, ready, analytics) {
    options = resolveOptions(options, this.key);
    this.options = extend({}, this.defaults, options);
    this.analytics = analytics;
    this.queue = [];
    this.ready = false;

    // augment ready to replay the queue and then set ready state
    var self = this;
    function dequeue () {
      each(self.queue, function (call) {
        self[call.method].apply(self, call.args);
      });
      self.ready = true;
      self.queue = [];
      ready();
    }

    this.initialize(this.options, dequeue);
  }

  // statics
  for (var key in statics) Integration[key] = statics[key];

  // protos
  Integration.prototype.name = name;
  for (var key in protos) Integration.prototype[key] = protos[key];

  return Integration;
}


/**
 * Resolve `options` with an optional `key`.
 *
 * @param {Object} options
 * @param {String} key (optional)
 */

function resolveOptions (options, key) {
  if (is.object(options)) return options;
  if (options === true) return {}; // BACKWARDS COMPATIBILITY
  if (key && is.string(options)) {
    var value = options;
    options[key] = value;
    return options;
  }
}

var extend = require('extend');


/**
 * BACKWARDS COMPATIBILITY: inheritance helper.
 *
 * Modeled after Backbone's `extend` method:
 * https://github.com/documentcloud/backbone/blob/master/backbone.js#L1464
 *
 * @param {Object} protos
 */

exports.extend = function (protos) {
  var parent = this;
  var child = function () { return parent.apply(this, arguments); };
  var Surrogate = function () { this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();
  extend(child.prototype, protos);
  return child;
};
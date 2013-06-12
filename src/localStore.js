
var bindAll  = require('bind-all')
  , defaults = require('defaults')
  , store    = require('store');


function Store (options) {
  this.options(options);
}


/**
 * Sets the options for the store
 *
 * @param  {Object} options
 *   @field {Boolean} enabled (true)
 */

Store.prototype.options = function (options) {
  if (arguments.length === 0) return this._options;

  options || (options = {});
  defaults(options, { enabled : true });

  this.enabled  = options.enabled && store.enabled;
  this._options = options;
};


/**
 * Sets a value in local storage
 *
 * @param  {String} key
 * @param  {Object} value
 */

Store.prototype.set = function (key, value) {
  if (!this.enabled) return false;
  return store.set(key, value);
};


/**
 * Gets a value from local storage
 *
 * @param  {String} key
 * @return {Object}
 */

Store.prototype.get = function (key) {
  if (!this.enabled) return null;
  return store.get(key);
};


/**
 * Removes a value from local storage
 *
 * @param  {String} key
 */

Store.prototype.remove = function (key) {
  if (!this.enabled) return false;
  return store.remove(key);
};


/**
 * Singleton exports
 */

module.exports = bindAll(new Store());
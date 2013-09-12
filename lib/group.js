
var bindAll = require('bind-all')
  , clone = require('clone')
  , cookie = require('./cookie')
  , defaults = require('defaults')
  , extend = require('extend')
  , store = require('./store');


/**
 * Initialize a new `Group`.
 *
 * @param {Object} options
 */

function Group (options) {
  this._id = null;
  this._properties = {};
  this.options(options);
}


/**
 * Set the `options` for the group.
 *
 * @param {Object} options
 *   @property {Object} cookie
 *   @property {Object} localStorage
 *   @property {Boolean} persist (default: `true`)
 */

Group.prototype.options = function (options) {
  options || (options = {});
  defaults(options, {
    persist: true
  });

  this.cookie(options.cookie);
  this.localStorage(options.localStorage);
  this.persist = options.persist;
};


/**
 * Get or set cookie `options`.
 *
 * @param {Object} options
 */

Group.prototype.cookie = function (options) {
  if (arguments.length === 0) return this.cookieOptions;
  options || (options = {});
  defaults(options, { key: 'ajs_group_id' });
  this.cookieOptions = options;
};


/**
 * Get or set local storage `options`.
 *
 * @param {Object} options
 */

Group.prototype.localStorage = function (options) {
  if (arguments.length === 0) return this.localStorageOptions;
  options || (options = {});
  defaults(options, { key: 'ajs_group_properties' });
  this.localStorageOptions = options;
};


/**
 * Get or set the group `id`.
 *
 * @param {String} id
 */

Group.prototype.id = function (id) {
  if (arguments.length === 0) return this._id;
  this._id = id;
};


/**
 * Get or set the group `properties`.
 *
 * @param {Object} properties
 */

Group.prototype.properties = function (properties) {
  if (arguments.length === 0) return clone(this._properties);
  this._properties = properties || {};
};


/**
 * Updates the current stored group with `id` and `properties`.
 *
 * @param {String} id
 * @param {Object} properties
 * @return {Boolean} whether alias should be called.
 */

Group.prototype.update = function (id, properties) {
  properties || (properties = {});

  // if there is a current group and the new group isn't the same,
  // we want to just replace their properties, otherwise extend
  if (this.id() && id && this.id() !== id) {
    this.properties(properties);
  } else {
    this.properties(extend(this.properties(), properties));
  }

  if (id) this.id(id);
  this.save();
};


/**
 * Save the group to local storage and the cookie.
 *
 * @return {Boolean} saved
 */

Group.prototype.save = function () {
  if (!this.persist) return false;
  cookie.set(this.cookie().key, this.id());
  store.set(this.localStorage().key, this.properties());
  return true;
};


/**
 * Load a saved group, and set its id and properties.
 *
 * @return {Object} group
 */

Group.prototype.load = function () {
  var id = cookie.get(this.cookie().key);
  var properties = store.get(this.localStorage().key);
  this.id(id);
  this.properties(properties);
  return this.toJSON();
};


/**
 * Clear the group, and remove any stored id and properties.
 */

Group.prototype.clear = function () {
  cookie.remove(this.cookie().key);
  store.remove(this.localStorage().key);
  this.id(null);
  this.properties({});
};


/**
 * Get the group info.
 *
 * @return {Object}
 */

Group.prototype.toJSON = function () {
  return {
    id: this.id(),
    properties: this.properties()
  };
};


/**
 * Export the new group as a singleton.
 */

module.exports = bindAll(new Group());
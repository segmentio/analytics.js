
var debug = require('debug')('analytics:group');
var bind = require('bind');
var clone = require('clone');
var cookie = require('./cookie');
var defaults = require('defaults');
var extend = require('extend');
var store = require('./store');
var traverse = require('isodate-traverse');


/**
 * Initialize a new `Group` with `options`.
 *
 * @param {Object} options
 */

function Group (options) {
  this.options(options);
  this.id(null);
  this.properties({});
}


/**
 * Get or set storage `options`.
 *
 * @param {Object} options
 *   @property {Object} cookie
 *   @property {Object} localStorage
 *   @property {Boolean} persist (default: `true`)
 */

Group.prototype.options = function (options) {
  if (arguments.length === 0) return this._options;
  options || (options = {});

  defaults(options, {
    persist: true,
    cookie: {
      key: 'ajs_group_id'
    },
    localStorage: {
      key: 'ajs_group_properties'
    }
  });

  this._options = options;
};


/**
 * Get or set the group's `id`.
 *
 * @param {String} id
 */

Group.prototype.id = function (id) {
  switch (arguments.length) {
    case 0: return this._getId();
    case 1: return this._setId(id);
  }
};


/**
 * Get the group's id.
 *
 * @return {String}
 */

Group.prototype._getId = function () {
  var ret = this._options.persist
    ? cookie.get(this._options.cookie.key)
    : this._id;
  return ret === undefined ? null : ret;
};


/**
 * Set the group's `id`.
 *
 * @param {String} id
 */

Group.prototype._setId = function (id) {
  if (this._options.persist) {
    cookie.set(this._options.cookie.key, id);
  } else {
    this._id = id;
  }
};


/**
 * Get or set the group's `properties`.
 *
 * @param {String} properties
 */

Group.prototype.properties = function (properties) {
  switch (arguments.length) {
    case 0: return this._getProperties();
    case 1: return this._setProperties(properties);
  }
};


/**
 * Get the group's properties. Always convert ISO date strings into real dates,
 * since they aren't parsed back from local storage.
 *
 * @return {Object}
 */

Group.prototype._getProperties = function () {
  var ret = this._options.persist
    ? store.get(this._options.localStorage.key)
    : this._properties;
  return ret ? traverse(clone(ret)) : {};
};


/**
 * Set the group's `properties`.
 *
 * @param {Object} properties
 */

Group.prototype._setProperties = function (properties) {
  properties || (properties = {});
  if (this._options.persist) {
    store.set(this._options.localStorage.key, properties);
  } else {
    this._properties = properties;
  }
};


/**
 * Idenfity the group with an `id` and `properties`. If we it's the same group,
 * extend the existing `properties` instead of overwriting.
 *
 * @param {String} id
 * @param {Object} properties
 */

Group.prototype.identify = function (id, properties) {
  properties || (properties = {});
  var current = this.id();
  if (current === null || current === id) properties = extend(this.properties(), properties);
  if (id) this.id(id);
  debug('identify %o, %o', id, properties);
  this.properties(properties);
  this.save();
};


/**
 * Save the group to local storage and the cookie.
 *
 * @return {Boolean}
 */

Group.prototype.save = function () {
  if (!this._options.persist) return false;
  cookie.set(this._options.cookie.key, this.id());
  store.set(this._options.localStorage.key, this.properties());
  return true;
};


/**
 * Log the group out, reseting `id` and `properties` to defaults.
 */

Group.prototype.logout = function () {
  this.id(null);
  this.properties({});
  cookie.remove(this._options.cookie.key);
  store.remove(this._options.localStorage.key);
};


/**
 * Reset all group state, logging out and returning options to defaults.
 */

Group.prototype.reset = function () {
  this.logout();
  this.options({});
};


/**
 * Load saved group `id` or `properties` from storage.
 */

Group.prototype.load = function () {
  this.id(cookie.get(this._options.cookie.key));
  this.properties(store.get(this._options.localStorage.key));
};


/**
 * Expose the group singleton.
 */

module.exports = bind.all(new Group());


/**
 * Expose the `Group` constructor.
 */

module.exports.Group = Group;

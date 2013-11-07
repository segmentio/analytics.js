
var debug = require('debug')('analytics:user');
var bind = require('bind');
var clone = require('clone');
var cookie = require('./cookie');
var defaults = require('defaults');
var extend = require('extend');
var store = require('./store');
var traverse = require('isodate-traverse');


/**
 * Initialize a new `User` with `options`.
 *
 * @param {Object} options
 */

function User (options) {
  this.options(options);
  this.id(null);
  this.traits({});
}


/**
 * Get or set storage `options`.
 *
 * @param {Object} options
 *   @property {Object} cookie
 *   @property {Object} localStorage
 *   @property {Boolean} persist (default: `true`)
 */

User.prototype.options = function (options) {
  if (arguments.length === 0) return this._options;
  options || (options = {});

  defaults(options, {
    persist: true,
    cookie: {
      key: 'ajs_user_id',
      oldKey: 'ajs_user'
    },
    localStorage: {
      key: 'ajs_user_traits'
    }
  });

  this._options = options;
};


/**
 * Get or set the user's `id`.
 *
 * @param {String} id
 */

User.prototype.id = function (id) {
  switch (arguments.length) {
    case 0: return this._getId();
    case 1: return this._setId(id);
  }
};


/**
 * Get the user's id.
 *
 * @return {String}
 */

User.prototype._getId = function () {
  var ret = this._options.persist
    ? cookie.get(this._options.cookie.key)
    : this._id;
  return ret === undefined ? null : ret;
};


/**
 * Set the user's `id`.
 *
 * @param {String} id
 */

User.prototype._setId = function (id) {
  if (this._options.persist) {
    cookie.set(this._options.cookie.key, id);
  } else {
    this._id = id;
  }
};


/**
 * Get or set the user's `traits`.
 *
 * @param {String} traits
 */

User.prototype.traits = function (traits) {
  switch (arguments.length) {
    case 0: return this._getTraits();
    case 1: return this._setTraits(traits);
  }
};


/**
 * Get the user's traits. Always convert ISO date strings into real dates, since
 * they aren't parsed back from local storage.
 *
 * @return {Object}
 */

User.prototype._getTraits = function () {
  var ret = this._options.persist
    ? store.get(this._options.localStorage.key)
    : this._traits;
  return ret ? traverse(clone(ret)) : {};
};


/**
 * Set the user's `traits`.
 *
 * @param {Object} traits
 */

User.prototype._setTraits = function (traits) {
  traits || (traits = {});
  if (this._options.persist) {
    store.set(this._options.localStorage.key, traits);
  } else {
    this._traits = traits;
  }
};


/**
 * Idenfity the user with an `id` and `traits`. If we it's the same user, extend
 * the existing `traits` instead of overwriting.
 *
 * @param {String} id
 * @param {Object} traits
 */

User.prototype.identify = function (id, traits) {
  traits || (traits = {});
  var current = this.id();
  if (current === null || current === id) traits = extend(this.traits(), traits);
  if (id) this.id(id);
  debug('identify %o, %o', id, traits);
  this.traits(traits);
  this.save();
};


/**
 * Save the user to local storage and the cookie.
 *
 * @return {Boolean}
 */

User.prototype.save = function () {
  if (!this._options.persist) return false;
  cookie.set(this._options.cookie.key, this.id());
  store.set(this._options.localStorage.key, this.traits());
  return true;
};


/**
 * Log the user out, reseting `id` and `traits` to defaults.
 */

User.prototype.logout = function () {
  this.id(null);
  this.traits({});
  cookie.remove(this._options.cookie.key);
  store.remove(this._options.localStorage.key);
};


/**
 * Reset all user state, logging out and returning options to defaults.
 */

User.prototype.reset = function () {
  this.logout();
  this.options({});
};


/**
 * Load saved user `id` or `traits` from storage.
 */

User.prototype.load = function () {
  if (this._loadOldCookie()) return;
  this.id(cookie.get(this._options.cookie.key));
  this.traits(store.get(this._options.localStorage.key));
};


/**
 * BACKWARDS COMPATIBILITY: Load the old user from the cookie.
 *
 * @return {Boolean}
 * @api private
 */

User.prototype._loadOldCookie = function () {
  var user = cookie.get(this._options.cookie.oldKey);
  if (!user) return false;

  this.id(user.id);
  this.traits(user.traits);
  cookie.remove(this._options.cookie.oldKey);
  return true;
};


/**
 * Expose the user singleton.
 */

module.exports = bind.all(new User());


/**
 * Expose the `User` constructor.
 */

module.exports.User = User;

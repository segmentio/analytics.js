
var bindAll = require('bind-all')
  , clone = require('clone')
  , cookie = require('./cookie')
  , defaults = require('defaults')
  , extend = require('extend')
  , store = require('./store');


/**
 * Initialize a new `User`.
 *
 * @param {Object} options
 */

function User (options) {
  this._id = null;
  this._traits = {};
  this.options(options);
}


/**
 * Set the `options` for the user.
 *
 * @param {Object} options
 *   @property {Object} cookie
 *   @property {Object} localStorage
 *   @property {Boolean} persist (default: `true`)
 */

User.prototype.options = function (options) {
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

User.prototype.cookie = function (options) {
  if (arguments.length === 0) return this.cookieOptions;
  options || (options = {});

  defaults(options, {
    key: 'ajs_user_id',
    oldKey: 'ajs_user'
  });
  this.cookieOptions = options;
};


/**
 * Get or set local storage `options`.
 *
 * @param {Object} options
 */

User.prototype.localStorage = function (options) {
  if (arguments.length === 0) return this.localStorageOptions;
  options || (options = {});

  defaults(options, {
    key: 'ajs_user_traits'
  });
  this.localStorageOptions = options;
};


/**
 * Get or set the user `id`.
 *
 * @param {String} id
 */

User.prototype.id = function (id) {
  if (arguments.length === 0) return this._id;
  this._id = id;
};


/**
 * Get or set the user `traits`.
 *
 * @param {Object} traits
 */

User.prototype.traits = function (traits) {
  if (arguments.length === 0) return clone(this._traits);
  this._traits = traits || {};
};


/**
 * Updates the current stored user with `id` and `traits`.
 *
 * @param {String} id
 * @param {Object} traits
 * @return {Boolean} whether alias should be called.
 */

User.prototype.update = function (id, traits) {
  // make an alias call if there was no previous id, there is one
  // now, and we are using a cookie between page loads
  var alias = !this.id() && id && this.persist;

  traits || (traits = {});

  // if there is a current user and the new user isn't the same,
  // we want to just replace their traits, otherwise extend
  if (this.id() && id && this.id() !== id) this.traits(traits);
  else this.traits(extend(this.traits(), traits));

  if (id) this.id(id);

  this.save();
  return alias;
};


/**
 * Save the user to local storage and the cookie.
 *
 * @return {Boolean} saved
 */

User.prototype.save = function () {
  if (!this.persist) return false;
  cookie.set(this.cookie().key, this.id());
  store.set(this.localStorage().key, this.traits());
  return true;
};


/**
 * Load a saved user, and set its id and traits.
 *
 * @return {Object} user
 */

User.prototype.load = function () {
  if (this.loadOldCookie()) return this.toJSON();

  var id = cookie.get(this.cookie().key);
  var traits = store.get(this.localStorage().key);
  this.id(id);
  this.traits(traits);

  return this.toJSON();
};


/**
 * Clear the user, and remove any stored id and traits.
 *
 */

User.prototype.clear = function () {
  cookie.remove(this.cookie().key);
  store.remove(this.localStorage().key);
  this.id(null);
  this.traits({});
};


/**
 * BACKWARDS COMPATIBILITY: Load the old user from the cookie.
 *
 * TODO: Should be phased out at some point.
 *
 * @return {Boolean} successful
 */

User.prototype.loadOldCookie = function () {
  var user = cookie.get(this.cookie().oldKey);
  if (!user) return false;

  this.id(user.id);
  this.traits(user.traits);
  cookie.remove(this.cookie().oldKey);
  return true;
};


/**
 * Get the user info.
 *
 * @return {Object}
 */

User.prototype.toJSON = function () {
  return {
    id: this.id(),
    traits: this.traits()
  };
};


/**
 * Export the new user as a singleton.
 */

module.exports = bindAll(new User());
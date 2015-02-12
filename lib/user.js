
var debug = require('debug')('analytics:user');
var Entity = require('./entity');
var inherit = require('inherit');
var bind = require('bind');
var cookie = require('./cookie');
var uuid = require('uuid');
var rawCookie = require('cookie');


/**
 * User defaults
 */

User.defaults = {
  persist: true,
  cookie: {
    key: 'ajs_user_id',
    oldKey: 'ajs_user'
  },
  localStorage: {
    key: 'ajs_user_traits'
  }
};


/**
 * Initialize a new `User` with `options`.
 *
 * @param {Object} options
 */

function User (options) {
  this.defaults = User.defaults;
  this.debug = debug;
  Entity.call(this, options);
}


/**
 * Inherit `Entity`
 */

inherit(User, Entity);

/**
 * Set / get the user id.
 *
 * When the user id changes, the method will
 * reset his anonymousId to a new one.
 *
 * Example:
 *
 *      // didn't change because the user didn't have previous id.
 *      anonId = user.anonymousId();
 *      user.id('foo');
 *      assert.equal(anonId, user.anonymousId());
 *
 *      // didn't change because the user id changed to null.
 *      anonId = user.anonymousId();
 *      user.id('foo');
 *      user.id(null);
 *      assert.equal(anonId, user.anonymousId());
 *
 *     // change because the user had previous id.
 *     anonId = user.anonymousId();
 *     user.id('foo');
 *     user.id('baz'); // triggers change
 *     user.id('baz'); // no change
 *     assert.notEqual(anonId, user.anonymousId());
 *
 * @param {String} id
 * @return {Mixed}
 */

User.prototype.id = function(id){
  var prev = this._getId();
  var ret = Entity.prototype.id.apply(this, arguments);
  if (null == prev) return ret;
  if (prev != id && id) this.anonymousId(null);
  return ret;
};

/**
 * Set / get / remove anonymousId.
 *
 * @param {String} anonId
 * @return {String|User}
 */

User.prototype.anonymousId = function(anonId){
  var store = this.storage();

  // set / remove
  if (arguments.length) {
    store.set('ajs_anonymous_id', anonId);
    return this;
  }

  // new
  if (anonId = store.get('ajs_anonymous_id')) {
    return anonId;
  }

  // old - it is not stringified so we use the raw cookie.
  if (anonId = rawCookie('_sio')) {
    anonId = anonId.split('----')[0];
    store.set('ajs_anonymous_id', anonId);
    store.remove('_sio');
    return anonId;
  }

  // empty
  anonId = uuid();
  store.set('ajs_anonymous_id', anonId);
  return store.get('ajs_anonymous_id');
};

/**
 * Remove anonymous id on logout too.
 */

User.prototype.logout = function(){
  Entity.prototype.logout.call(this);
  this.anonymousId(null);
};

/**
 * Load saved user `id` or `traits` from storage.
 */

User.prototype.load = function () {
  if (this._loadOldCookie()) return;
  Entity.prototype.load.call(this);
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

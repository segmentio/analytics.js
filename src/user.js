var cookieStore = require('cookie')
  , clone       = require('clone')
  , extend      = require('extend')
  , json        = require('json')
  , type        = require('type');


/**
 * Make a new user.
 */

var user = newUser();


/**
 * Default cookie settings.
 */

var cookie = exports.cookie = {
  name    : 'ajs_user',
  maxage  : 31536000000, // default to a year
  enabled : true,
  path    : '/',
};


/**
 * Set the options for our user storage.
 *
 * @param {Object} options - settings.
 *
 *   @field {Boolean|Object} cookie - whether to use a cookie.
 *     @field {String} name - what to call the cookie (eg. 'ajs_user').
 *     @field {Number} maxage - expiration time in milliseconds for the cookie,
 *     defaulting to one year.
 *     @field {
 */

exports.options = function (options) {
  options || (options = {});

  // Support just passing in a boolean for cookie.
  if ('boolean' === type(options.cookie)) {
    cookie.enabled = options.cookie;
  }

  else if ('object' === type(options.cookie)) {
    cookie.enabled = true;
    if (options.cookie.name)   cookie.name   = options.cookie.name;
    if (options.cookie.maxage) cookie.maxage = options.cookie.maxage;
    if (options.cookie.domain) cookie.domain = options.cookie.domain;
    if (options.cookie.path)   cookie.path   = options.cookie.path;

    if (cookie.domain && cookie.domain.charAt(0) !== '.') {
      cookie.domain = '.' + cookie.domain;
    }
  }
};


/**
 * Get the current user's ID.
 */

exports.id = function () {
  return user.id;
};


/**
 * Get the current user's traits.
 */

exports.traits = function () {
  return clone(user.traits);
};


/**
 * Updates the current stored user with id and traits.
 *
 * @param {String} userId - the new user ID.
 * @param {Object} traits - any new traits.
 *
 * @return {Boolean} whether alias should be called.
 */

exports.update = function (userId, traits) {

  // Make an alias call if there was no previous userId, there is one
  // now, and we are using a cookie between page loads.
  var alias = !user.id && userId && cookie.enabled;

  traits || (traits = {});

  // If there is a current user and the new user isn't the same,
  // we want to just replace their traits. Otherwise extend.
  if (user.id && userId && user.id !== userId) user.traits = traits;
  else extend(user.traits, traits);

  if (userId) user.id = userId;

  if (cookie.enabled) save(user);

  return alias;
};


/**
 * Clears the user and wipes the cookie.
 */

exports.clear = function () {
  if (cookie.enabled) cookieStore(cookie.name, null, clone(cookie));
  user = newUser();
};


/**
 * Save the user object to a cookie
 *
 * @param {Object} user
 *
 * @return {Boolean} saved
 */

var save = function (user) {
  try {
    cookieStore(cookie.name, json.stringify(user), clone(cookie));
    return true;
  } catch (e) {
    return false;
  }
};


/**
 * Load the data from our cookie.
 *
 * @return {Object} - the current user.
 *   @field {String} id - the current user's ID.
 *   @field {Object} traits - the current user's traits.
 */

exports.load = function () {
  if (!cookie.enabled) return user;

  try {
    var storedUser = cookieStore(cookie.name);

    if (storedUser) user = json.parse(storedUser);
    else user = newUser();
  } catch (e) {
    // If the json or cookie is bad
    user = newUser();
  }

  return user;
};


/**
 * Returns a new user object.
 */

function newUser() {
  return {
    id : null,
    traits : {}
  };
}
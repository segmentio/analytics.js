
var cookieStore = require('cookie')
  , clone       = require('clone')
  , extend      = require('extend')
  , json        = require('json')
  , type        = require('type');


var user   = newUser();

var cookie = exports.cookie = {
  name    : 'ajs_user',
  maxage  : 31536000000, // default to a year
  enabled : true,
  path    : '/',
};


/**
 * Set the options for our user storage.
 * @param  {Object} options
 *   @field {Boolean|Object} cookie - whether to use a cookie
 *     @field {String}  name   - what to call the cookie ('ajs_user')
 *     @field {Number}  maxage - time in ms to keep the cookie. (one year)
 *     @field {
 */
exports.options = function (options) {

  options || (options = {});

  if (type(options.cookie) === 'boolean') {

    cookie.enabled = options.cookie;

  } else if (type(options.cookie) === 'object') {
    cookie.enabled = true;
    if (options.cookie.name)   cookie.name   = options.cookie.name;
    if (options.cookie.maxage) cookie.maxage = options.cookie.maxage;
    if (options.cookie.domain) cookie.domain = options.cookie.domain;
    if (options.cookie.path)   cookie.path   = options.cookie.path;

    if (cookie.domain && cookie.domain.charAt(0) !== '.')
      cookie.domain = '.' + cookie.domain;
  }
};


exports.id = function () {
  return user.id;
};


exports.traits = function () {
  return clone(user.traits);
};


/**
 * Updates the stored user with id and trait information
 * @param  {String}  userId
 * @param  {Object}  traits
 * @return {Boolean} whether alias should be called
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
 * Clears the user, wipes the cookie.
 */
exports.clear = function () {
  if (cookie.enabled) cookieStore(cookie.name, null, clone(cookie));
  user = newUser();
};


/**
 * Save the user object to a cookie
 * @param  {Object}  user
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
 * @return {Object}
 *   @field {String} id
 *   @field {Object} traits
 */
exports.load = function () {

  if (!cookie.enabled) return user;

  var storedUser = cookieStore(cookie.name);

  if (storedUser) {
    try {
      user = json.parse(storedUser);
    } catch (e) {
      // if we got bad json, toss the entire thing.
      user = newUser();
    }
  }

  return user;
};


/**
 * Returns a new user object
 */
function newUser() {
  return {
    id     : null,
    traits : {}
  };
}
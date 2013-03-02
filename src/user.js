
var cookieStore = require('cookie')
  , json        = require('json')
  , extend      = require('extend');


var user = newUser();

var cookie = exports.cookie = {
  name    : 'ajs_user',
  maxage  : 31536000000, // default to a year
  enabled : true
};


/**
 * Updates the stored user with id and trait information
 * @param  {String}  userId
 * @param  {Object}  traits
 * @return {Boolean} whether the alias should be called
 */
exports.update = function (userId, traits) {

  // Whether we should make an alias call.
  var alias = !user.id && userId;

  traits || (traits = {});

  // If there is a current user and the new user isn't the same,
  // we want to replace their traits. Otherwise extend.
  if (user.id && userId && user.id !== userId) user.traits = traits || {};
  else extend(user.traits, traits);

  if (userId) user.id = userId;

  if (cookie.enabled) save(user);

  return alias;
};


/**
 * Getter for the stored user object.
 * @return {Object} user
 */
exports.get = function () {
  return user;
};


exports.clear = function () {
  if (cookie.enabled) cookieStore(cookie.name, null);
  user = newUser();
};


/**
 * Save the user object to a cookie
 * @param  {Object}  user
 * @return {Boolean} saved
 */
var save = function (user) {
  try {
    cookieStore(cookie.name, json.stringify(user), cookie);
    return true;
  } catch (e) {
    return false;
  }
};


/**
 * Load the data from our cookie.
 * @param {Object} options
 *   @field {Boolean} cookie - if you don't want to use set a cookie, set cookie to 'false'
 *
 * @return {Object}
 *   @field {String} id
 *   @field {Object} traits
 */
exports.load = function (options) {

  options || (options = {});

  if (options.cookie === false) cookie.enabled = false;
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


function newUser() {
  return {
    id     : null,
    traits : {}
  };
}
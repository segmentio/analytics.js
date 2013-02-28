
var cookie = require('cookie')
  , json   = require('json')
  , extend = require('extend');


var user = {
  id     : null,
  traits : null
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

  if (traits) {
    user.traits || (user.traits = {});
    extend(user.traits, traits);
  }

  save(user);

  return alias;
};


/**
 * Getter for the stored user object.
 * @return {Object} user
 */
exports.get = function () {
  return user;
};


/**
 * Save the user object to a cookie
 * @param  {Object}  user
 * @return {Boolean} saved
 */
var save = function (user) {
  try {
    cookie('ajs_user', json.stringify(user));
    return true;
  } catch (e) {
    return false;
  }
};


/**
 * Load the data from our cookie.
 * @return {Object}
 *   @field {String} id
 *   @field {Object} traits
 */
exports.load = function () {

  var storedUser = cookie('ajs_user');

  if (storedUser) {
    try {
      user = json.parse(storedUser);
    } catch (e) {
      user = null; // if we got bad json, toss the entire thing.
    }
  }

  return user;
};
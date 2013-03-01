
var cookie = require('cookie')
  , json   = require('json')
  , extend = require('extend');


var user = newUser();


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


exports.clear = function () {
  cookie('ajs_user', null);
  user = newUser();
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
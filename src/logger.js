


/**
 * Module exports.
 */

module.exports = Logger;


/**
 * Loggger
 *
 * @param {Array}  providers   An array of provider instances to log to.
 * @param {Object} properties  Default properties to back each log with.
 */

function Logger (providers, properties) {
  this.providers = providers;
}


/**
 * Log
 *
 * @param {String} level          The level of the log call.
 * @param {Error|String} message  The message to log.
 * @param {Object}       options  Options to
 */

var integration = require('../integration')
  , load = require('load-script')
  , onBody = require('on-body');


/**
 * Expose `Awesomatic` integration.
 */

var Awesomatic = module.exports = integration('Awesomatic');


/**
 * Required key.
 */

Awesomatic.prototype.key = 'appId';


/**
 * Default options.
 */

Awesomatic.prototype.defaults = {
  // your awesomatic app id (required)
  appId: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Awesomatic.prototype.initialize = function (options, ready) {
  load('https://1c817b7a15b6941337c0-dff9b5f4adb7ba28259631e99c3f3691.ssl.cf2.rackcdn.com/gen/embed.js', function() {
    window.Awesomatic.initialize({ appId:options.appId }, ready);
  });
};

/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Awesomatic.prototype.identify = function (id, traits, options) {
  if (!id && !traits.email) return; // one is required
  if (id) traits.userId = id;
  window.Awesomatic.load(traits);
};

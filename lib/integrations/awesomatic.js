
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

Awesomatic.prototype.key = 'app_id';


/**
 * Default options.
 */

Awesomatic.prototype.defaults = {
  // your awesomatic app id (required)
  app_id: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Awesomatic.prototype.initialize = function (options, ready) {
  window.AwesomaticSettings = {
    app_id: options.app_id,
    disabled: true
  };
  load('https://1c817b7a15b6941337c0-dff9b5f4adb7ba28259631e99c3f3691.ssl.cf2.rackcdn.com/embed/app.js', function() {
    var timeoutReady = function() {
      setTimeout(function(){
        if (window.Awesomatic) {
          ready();
        } else {
          timeoutReady();
        }
      }, 200);
    };
    timeoutReady();
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

  if (traits.email) {
    window.AwesomaticSettings.email = traits.email;
  } else {
    window.AwesomaticSettings.user_id = id;
  }
  if (traits.username) window.AwesomaticSettings.username = traits.username; 
  if (traits.avatar) window.AwesomaticSettings.avatar = traits.avatar;
  if (traits.group) window.AwesomaticSettings.group = traits.group;
  
  window.Awesomatic.load();
};

/*
 * http://rollbar.com/
 */

var extend = require('extend')
  , clone = require('clone')
  , integration = require('../integration')
  , load = require('load-script')
  , onError = require('on-error');

/**
 * Expose `Rollbar` integration.
 *
 * https://rollbar.com/docs/notifier/rollbar.js/
 */

var Rollbar = module.exports = integration('Rollbar');


/**
 * Required access token.
 */

Rollbar.prototype.key = 'accessToken';


/**
 * Default options.
 */

Rollbar.prototype.defaults = {
  accessToken: null,
  identify: true
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Rollbar.prototype.initialize = function (options, ready) {
  var rollbarOptions = clone(options);
  window._rollbar = window._rollbar || 
                    window._ratchet || 
                    [options.accessToken, rollbarOptions];
  load('//d37gvrvc0wt4s1.cloudfront.net/js/1/rollbar.min.js');

  // Attach the window `onerror` event.
  onError(function() {
    window._rollbar.push(arguments);
  });

  // Rollbar is ready right away since window._rollbar is available
  ready();
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Rollbar.prototype.identify = function (id, traits, options) {
  // Don't set any person metadata if identify is false
  if (!this.options.identify) return;

  traits = traits || {};
  if (id) traits.id = id;

  if (window._rollbar.shift) {
    var extraParams = window._rollbar[1] || {};
    extend(extraParams, {person: traits});
    window._rollbar[1] = extraParams;
  } else {
    var extraParams = window._rollbar.extraParams || {};
    extraParams.person = extraParams.person || {};
    extend(extraParams.person, traits);
    window._rollbar.extraParams = extraParams;
  }
};

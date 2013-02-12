// LiveChat
// --------
// [Documentation](http://www.livechatinc.com/api/javascript-api).

var each   = require('each')
  , extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = LiveChat;

function LiveChat () {
  this.settings = {
    license : null
  };
}


LiveChat.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'license');
  extend(this.settings, settings);

  window.__lc = {
    license : this.settings.license
  };

  load('//cdn.livechatinc.com/tracking.js');
};


// LiveChat isn't an analytics service, but we can use the `userId` and
// `traits` to tag the user with their real name in the chat console.
LiveChat.prototype.identify = function (userId, traits) {
  // In case the LiveChat library hasn't loaded yet.
  if (!window.LC_API) return;

  // We need either a `userId` or `traits`.
  if (!userId && !traits) return;

  // LiveChat takes them in an array format.
  var variables = [];

  if (userId) variables.push({ name: 'User ID', value: userId });

  if (traits) {
    each(traits, function (value, key) {
      variables.push({
        name  : key,
        value : value
      });
    });
  }

  window.LC_API.set_custom_variables(variables);
};



// LiveChat
// --------
// [Documentation](http://www.livechatinc.com/api/javascript-api).

var each  = require('each')
  , utils = require('../../utils');


module.exports = LiveChat;

function LiveChat () {
  this.settings = {
    license : null
  };
}


LiveChat.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'license');
  utils.extend(this.settings, settings);

  window.__lc = {};
  window.__lc.license = this.settings.license;

  (function() {
      var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
      lc.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
  })();
};


// LiveChat isn't an analytics service, but we can use the `userId` and
// `traits` to tag the user with their real name in the chat console.
LiveChat.prototype.identify = function (userId, traits) {
  // We aren't guaranteed the variable exists.
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



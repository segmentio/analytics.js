// http://www.livechatinc.com/api/javascript-api

var Provider = require('../provider')
  , each     = require('each')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'LiveChat',

  key : 'license',

  defaults : {
    license : null
  },

  initialize : function (options, ready) {
    window.__lc = { license : options.license };
    load('//cdn.livechatinc.com/tracking.js', ready);
  },

  // LiveChat isn't an analytics service, but we can use the `userId` and
  // `traits` to tag the user with their real name in the chat console.
  identify : function (userId, traits) {
    // In case the LiveChat library hasn't loaded yet.
    if (!window.LC_API) return;

    // We need either a `userId` or `traits`.
    if (!userId && !traits) return;

    // LiveChat takes them in an array format.
    var variables = [];

    if (userId) variables.push({ name: 'User ID', value: userId });
    if (traits) {
      each(traits, function (key, value) {
        variables.push({
          name  : key,
          value : value
        });
      });
    }

    window.LC_API.set_custom_variables(variables);
  }

});
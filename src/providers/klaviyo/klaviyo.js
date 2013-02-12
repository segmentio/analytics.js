// Klaviyo
// -------
// [Documentation](https://www.klaviyo.com/docs).

var utils = require('../../utils');

module.exports = Klaviyo;

function Klaviyo () {
  this.settings = {
    apiKey : null
  };
}


// Changes to the Klaviyo snippet:
//
// * Added `apiKey`.
Klaviyo.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'apiKey');
  utils.extend(this.settings, settings);

  var _learnq = window._learnq = window._learnq || [];
  _learnq.push(['account', this.settings.apiKey]);
  (function () {
    var b = document.createElement('script');
    b.type = 'text/javascript';
    b.async = true;
    b.src = ('https:' === document.location.protocol ? 'https://' : 'http://') +
        'a.klaviyo.com/media/js/learnmarklet.js';
    var a = document.getElementsByTagName('script')[0];
    a.parentNode.insertBefore(b, a);
  })();
};


Klaviyo.prototype.identify = function (userId, traits) {
  // Klaviyo takes the user ID on the traits object itself.
  traits || (traits = {});
  if (userId) traits.$id = userId;

  window._learnq.push(['identify', traits]);
};


Klaviyo.prototype.track = function (event, properties) {
  window._learnq.push(['track', event, properties]);
};
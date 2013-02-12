// Klaviyo
// -------
// [Documentation](https://www.klaviyo.com/docs).

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');

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
  extend(this.settings, settings);

  window._learnq = window._learnq || [];
  window._learnq.push(['account', this.settings.apiKey]);

  load('//a.klaviyo.com/media/js/learnmarklet.js');
};


Klaviyo.prototype.identify = function (userId, traits) {
  if (!userId && !traits) return;

  // Klaviyo takes the user ID on the traits object itself.
  traits || (traits = {});
  if (userId) traits.$id = userId;

  window._learnq.push(['identify', traits]);
};


Klaviyo.prototype.track = function (event, properties) {
  window._learnq.push(['track', event, properties]);
};
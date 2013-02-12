// GetVero.com
// -----------
// [Documentation](https://github.com/getvero/vero-api/blob/master/sections/js.md).

var utils = require('../../utils');


module.exports = Vero;

function Vero () {
  this.settings = {
    apiKey : null
  };
}


Vero.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'apiKey');
  utils.extend(this.settings, settings);

  var _veroq = window._veroq = window._veroq || [];

  _veroq.push(['init', { api_key: settings.apiKey }]);

  (function(){
    var ve = document.createElement('script');
    ve.type = 'text/javascript';
    ve.async = true;
    var protocol = ('https:' === document.location.protocol) ? 'https:' : 'http:';
    ve.src = protocol + '//www.getvero.com/assets/m.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ve, s);
  })();
};


Vero.prototype.identify = function (userId, traits) {
  // Don't do anything if we just have traits, because Vero
  // requires a `userId`.
  if (!userId) return;

  traits || (traits = {});

  // Vero takes the `userId` as part of the traits object.
  traits.id = userId;

  // If there wasn't already an email and the userId is one, use it.
  if (!traits.email && utils.isEmail(userId)) traits.email = userId;

  // Vero *requires* an email and an id
  if (!traits.id || !traits.email) return;

  window._veroq.push(['user', traits]);
};


Vero.prototype.track = function (event, properties) {
        window._veroq.push(['track', event, properties]);
};
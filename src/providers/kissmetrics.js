// KISSmetrics
// -----------
// [Documentation](http://support.kissmetrics.com/apis/javascript).

var extend = require('extend')
  , alias  = require('alias')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = KISSmetrics;

function KISSmetrics () {
  this.settings = {
    apiKey : null
  };
}


// Initialize
// ----------
// Changes to the KISSmetrics snippet:
//
// * Concatenate the `apiKey` into the URL.
KISSmetrics.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'apiKey');
  extend(this.settings, settings);

  window._kmq = window._kmq || [];
  load('//i.kissmetrics.com/i.js');
  load('//doug1izaerwt3.cloudfront.net/' + this.settings.apiKey + '.1.js');
};


// KISSmetrics uses two separate methods: `identify` for storing the
// `userId`, and `set` for storing `traits`.
KISSmetrics.prototype.identify = function (userId, traits) {
  if (userId) window._kmq.push(['identify', userId]);
  if (traits) window._kmq.push(['set', traits]);
};


KISSmetrics.prototype.track = function (event, properties) {
  // KISSmetrics handles revenue with the `'Billing Amount'` property by
  // default, although it's changeable in the interface.
  if (properties) {
    alias(properties, {
      'revenue' : 'Billing Amount'
    });
  }

  window._kmq.push(['record', event, properties]);
};


// Although undocumented, KISSmetrics actually supports not passing a second
// ID, in which case it uses the currenty identified user's ID.
KISSmetrics.prototype.alias = function (newId, originalId) {
  window._kmq.push(['alias', newId, originalId]);
};



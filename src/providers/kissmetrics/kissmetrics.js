// KISSmetrics
// -----------
// [Documentation](http://support.kissmetrics.com/apis/javascript).

var utils = require('../../utils');


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
  utils.extend(this.settings, settings);

  var _kmq = window._kmq = window._kmq || [];
  function _kms(u){
    setTimeout(function(){
      var d = document,
          f = d.getElementsByTagName('script')[0],
          s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      var protocol = ('https:' === document.location.protocol) ? 'https:' : 'http:';
      s.src = protocol + u;
      f.parentNode.insertBefore(s, f);
    }, 1);
  }

  _kms('//i.kissmetrics.com/i.js');
  _kms('//doug1izaerwt3.cloudfront.net/'+this.settings.apiKey+'.1.js');
};


KISSmetrics.prototype.identify = function (userId, traits) {
  // KISSmetrics uses two separate methods: `identify` for storing the
  // `userId`, and `set` for storing `traits`.
  if (userId) window._kmq.push(['identify', userId]);
  if (traits) window._kmq.push(['set', traits]);
};


KISSmetrics.prototype.track = function (event, properties) {
  // KISSmetrics handles revenue with the `'Billing Amount'` property by
  // default, although it's changeable in the interface.
  utils.alias(properties, {
    'revenue' : 'Billing Amount'
  });

  window._kmq.push(['record', event, properties]);
};


KISSmetrics.prototype.alias = function (newId, originalId) {
  // Although undocumented, KISSmetrics actually supports not passing a second
  // ID, in which case it uses the currenty identified user's ID.
  window._kmq.push(['alias', newId, originalId]);
};



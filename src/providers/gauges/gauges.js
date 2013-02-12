// Gauges
// -------
// [Documentation](http://get.gaug.es/documentation/tracking/).

var utils = require('../../utils');


module.exports = Gauges;

function Gauges () {
  this.settings = {
    siteId : null
  };
}


Gauges.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'siteId');
  utils.extend(this.settings, settings);

  var _gauges = window._gauges = window._gauges || [];

  (function() {
    var t   = document.createElement('script');
    t.type  = 'text/javascript';
    t.async = true;
    t.id    = 'gauges-tracker';
    t.setAttribute('data-site-id', settings.siteId);
    var protocol = ('https:' == document.location.protocol) ? 'https:' : 'http:';
    t.src = protocol + '//secure.gaug.es/track.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
  })();
};


Gauges.prototype.pageview = function (url) {
  window._gauges.push(['track']);
};
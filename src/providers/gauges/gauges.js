// Gauges
// -------
// [Documentation](http://get.gaug.es/documentation/tracking/).

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = Gauges;

function Gauges () {
  this.settings = {
    siteId : null
  };
}


Gauges.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'siteId');
  extend(this.settings, settings);

  window._gauges = window._gauges || [];

  // Load the library and add the `id` and `data-site-id` Gauges needs.
  var script = load('//secure.gaug.es/track.js');
  script.id = 'gauges-tracker';
  script.setAttribute('data-site-id', this.settings.siteId);
};


Gauges.prototype.pageview = function (url) {
  window._gauges.push(['track']);
};
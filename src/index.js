
var Analytics = require('./analytics')
  , each      = require('each')
  , utils     = require('./utils')
  , providers = require('./providers');

// Wrap any existing `onload` function with our own that will cache the
// loaded state of the page.
var oldonload = window.onload;
var analytics = window.analytics = new Analytics();

analytics.utils = utils; // TODO: get rid of me

each(providers, function (key, Provider) {
  analytics.addProvider(key, new Provider());
});

window.onload = function () {
  window.analytics.loaded = true;
  if (utils.isFunction(oldonload)) oldonload();
};

module.exports = analytics;
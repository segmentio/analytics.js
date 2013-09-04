
var integration = require('../integration')
  , onBody = require('on-body')
  , load = require('load-script');


/**
 * Expose `Chartbeat` integration.
 */

var Chartbeat = module.exports = integration('Chartbeat');


/**
 * Default options.
 */

Chartbeat.prototype.defaults = {
  // the domain of the site your installing chartbeat on (required)
  domain: '',
  // your chartbeat uid (required)
  uid: null
};


/**
 * Initialize.
 *
 * http://chartbeat.com/docs/adding_the_code/
 * http://chartbeat.com/docs/configuration_variables/
 *
 * @param {Object} options
 * @param {Function} ready
 */

Chartbeat.prototype.initialize = function (options, ready) {
  window._sf_async_config = options;
  onBody(function () {
    window._sf_endpt = new Date().getTime();
    load({
      https: 'https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/js/chartbeat.js',
      http: 'http://static.chartbeat.com/js/chartbeat.js'
    }, ready);
  });
};


/**
 * Pageview.
 *
 * http://chartbeat.com/docs/handling_virtual_page_changes/
 *
 * @param {String} url (optional)
 */

Chartbeat.prototype.pageview = function (url) {
  window.pSUPERFLY.virtualPage(url || window.location.pathname);
};
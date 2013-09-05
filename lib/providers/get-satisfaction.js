
var integration = require('../integration')
  , load = require('load-script')
  , onBody = require('on-body');


/**
 * Expose `GetSatisfaction` integration.
 */

var GetSatisfaction = module.exports = integration('Get Satisfaction');


/**
 * Required key.
 */

GetSatisfaction.prototype.key = 'widgetId';


/**
 * Default options.
 */

GetSatisfaction.prototype.defaults = {
  // your get satisfaction widget id (required)
  widgetId: ''
};


/**
 * Initialize.
 *
 * https://console.getsatisfaction.com/start/101022?signup=true#engage
 * (must be signed in to view)
 *
 * @param {Object} options
 * @param {Function} ready
 */

GetSatisfaction.prototype.initialize = function (options, ready) {
  // append the div that will become the get satisfaction tab
  var div = document.createElement('div');
  var id = div.id = 'getsat-widget-' + options.widgetId;
  onBody(function (body) {
    body.appendChild(div);
  });

  // usually the snippet is sync, so wait for it before initializing the tab
  load('https://loader.engage.gsfn.us/loader.js', function () {
    window.GSFN.loadWidget(options.widgetId, { containerId : id });
    ready();
  });
};
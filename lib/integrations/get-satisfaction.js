
var integration = require('integration');
var load = require('load-script-once');
var onBody = require('on-body');


/**
 * Expose `GetSatisfaction`.
 */

var GetSatisfaction = module.exports = integration('Get Satisfaction')
  .assumesPageview()
  .readyOnLoad()
  .option('widgetId', '');


/**
 * Exists?
 */

GetSatisfaction.prototype.exists = function () {
  return !! window.GSFN;
};


/**
 * Initialize.
 *
 * https://console.getsatisfaction.com/start/101022?signup=true#engage
 */

GetSatisfaction.prototype.initialize = function () {
  var widget = this.options.widgetId;
  var div = document.createElement('div');
  var id = div.id = 'getsat-widget-' + widget;
  onBody(function (body) { body.appendChild(div); });

  // usually the snippet is sync, so wait for it before initializing the tab
  this.load(function () {
    window.GSFN.loadWidget(widget, { containerId: id });
  });
};


/**
 * Load the Get Satisfaction library.
 *
 * @param {Function} callback
 */

GetSatisfaction.prototype.load = function (callback) {
  load('https://loader.engage.gsfn.us/loader.js', callback);
};
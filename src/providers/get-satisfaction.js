// You have to be signed in to access the snippet code:
// https://console.getsatisfaction.com/start/101022?signup=true#engage

var Provider = require('../provider')
  , load     = require('load-script')
  , onBody   = require('on-body');


module.exports = Provider.extend({

  name : 'Get Satisfaction',

  key : 'widgetId',

  options : {
    widgetId : null
  },

  initialize : function (options, ready) {
    // Get Satisfaction requires a div that will become their widget tab. Append
    // it once `document.body` exists.
    var div = document.createElement('div');
    var id = div.id = 'getsat-widget-' + options.widgetId;
    onBody(function (body) {
      body.appendChild(div);
    });

    // Usually they load their snippet synchronously, so we need to wait for it
    // to come back before initializing the tab.
    load('https://loader.engage.gsfn.us/loader.js', function () {
      if (window.GSFN !== undefined) {
        window.GSFN.loadWidget(options.widgetId, { containerId : id });
      }
      ready();
    });

  }

});
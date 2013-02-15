// Keen IO
// -------
// [Documentation](https://keen.io/docs/).

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  options : {
    // Keen IO has two required options: `projectId` and `apiKey`.
    projectId : null,
    apiKey    : null
  },


  initialize : function (options, ready) {
    window.Keen = window.Keen||{configure:function(a,b,c){this._pId=a;this._ak=b;this._op=c},addEvent:function(a,b,c,d){this._eq=this._eq||[];this._eq.push([a,b,c,d])},setGlobalProperties:function(a){this._gp=a},onChartsReady:function(a){this._ocrq=this._ocrq||[];this._ocrq.push(a)}};
    window.Keen.configure(options.projectId, options.apiKey);

    load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.0.0-min.js');

    // Keen IO actually defines all their functions in their snippet, so they
    // are ready immediately.
    ready();
  },


  identify : function(userId, traits) {
    // In case the Keen IO library hasn't loaded yet.
    if (!window.Keen.setGlobalProperties) return;

    // Use Keen IO global properties to include `userId` and `traits` on
    // every event sent to Keen IO.
    var globalUserProps = {};
    if (userId) globalUserProps.userId = userId;
    if (traits) globalUserProps.traits = traits;
    if (userId || traits) {
      window.Keen.setGlobalProperties(function(eventCollection) {
        return { user: globalUserProps };
      });
    }
  },


  track : function(event, properties) {
    // In case the Keen IO library hasn't loaded yet.
    if (!window.Keen.addEvent) return;

    window.Keen.addEvent(event, properties);
  }

});
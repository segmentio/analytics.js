// Keen IO
// -------
// [Documentation](https://keen.io/docs/).

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = KeenIO;

function KeenIO () {
  this.settings = {
    projectId : null,
    apiKey    : null
  };
}


KeenIO.prototype.initialize = function (settings) {
  if (!settings.projectId || !settings.apiKey) {
    throw new Error('Settings must be an object with properties projectId and apiKey.');
  }
  extend(this.settings, settings);

  window.Keen = window.Keen||{configure:function(a,b,c){this._pId=a;this._ak=b;this._op=c},addEvent:function(a,b,c,d){this._eq=this._eq||[];this._eq.push([a,b,c,d])},setGlobalProperties:function(a){this._gp=a},onChartsReady:function(a){this._ocrq=this._ocrq||[];this._ocrq.push(a)}};

  // Configure the Keen object with your Project ID and API Key.
  window.Keen.configure(this.settings.projectId, this.settings.apiKey);

  load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.0.0-min.js');
};


KeenIO.prototype.identify = function(userId, traits) {
  // In case the Keen library hasn't loaded yet.
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
};


KeenIO.prototype.track = function(event, properties) {
  // In case the Keen library hasn't loaded yet.
  if (!window.Keen.addEvent) return;

  window.Keen.addEvent(event, properties);
};
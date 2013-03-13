// https://keen.io/docs/

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Keen IO',

  options : {
    // Keen IO has two required options: `projectId` and `apiKey`.
    projectId : null,
    apiKey : null,
    // Whether or not to pass pageviews on to Keen IO.
    pageview : false,
    // Whether or not to track an initial pageview on `initialize`.
    initialPageview : false,
    // Whether to track log calls, prefixing them with "Log: ".
    log : false
  },

  initialize : function (options, ready) {
    window.Keen = window.Keen||{configure:function(a,b,c){this._pId=a;this._ak=b;this._op=c},addEvent:function(a,b,c,d){this._eq=this._eq||[];this._eq.push([a,b,c,d])},setGlobalProperties:function(a){this._gp=a},onChartsReady:function(a){this._ocrq=this._ocrq||[];this._ocrq.push(a)}};
    window.Keen.configure(options.projectId, options.apiKey);

    load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.0.0-min.js');

    if (options.initialPageview) this.pageview();

    // Keen IO defines all their functions in the snippet, so they
    // are ready immediately.
    ready();
  },

  identify : function (userId, traits) {
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

  track : function (event, properties) {
    window.Keen.addEvent(event, properties);
  },

  pageview : function (url) {
    if (!this.options.pageview) return;

    var properties;
    if (url) properties = { url : url };

    this.track('Loaded a Page', properties);
  },

  log : function (error, properties) {
    if (!this.options.log) return;

    // Keen IO only tracks messages, so turn Error's into strings.
    // TODO: make this cross-browser.
    if (error instanceof Error) error = error.message;

    // Prepend log, incase they're also tracking regular events.
    error = 'Log: ' + error;

    this.track(error, properties);
  }

});
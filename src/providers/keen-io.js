// https://keen.io/docs/

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Keen IO',

  defaults : {
    // The Project ID is **required**.
    projectId : null,
    // The Write Key is **required** to send events.
    writeKey : null,
    // The Read Key is optional, only if you want to "do analysis".
    readKey : null,
    // Whether or not to pass pageviews on to Keen IO.
    pageview : true,
    // Whether or not to track an initial pageview on `initialize`.
    initialPageview : true
  },

  initialize : function (options, ready) {
    window.Keen = window.Keen||{configure:function(e){this._cf=e},addEvent:function(e,t,n,i){this._eq=this._eq||[],this._eq.push([e,t,n,i])},setGlobalProperties:function(e){this._gp=e},onChartsReady:function(e){this._ocrq=this._ocrq||[],this._ocrq.push(e)}};
    window.Keen.configure({
      projectId : options.projectId,
      writeKey  : options.writeKey,
      readKey   : options.readKey
    });

    load('//dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js');

    if (options.initialPageview) this.pageview();

    // Keen IO defines all their functions in the snippet, so they're ready.
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

    var properties = {
      url  : url || document.location.href,
      name : document.title
    };

    this.track('Loaded a Page', properties);
  }

});
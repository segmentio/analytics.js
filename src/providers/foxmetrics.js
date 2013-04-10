// http://foxmetrics.com/documentation/apijavascript

var Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'FoxMetrics',

  key : 'appId',

  defaults : {
    appId : null
  },

  initialize : function (options, ready) {
    var _fxm = window._fxm || {};
    window._fxm = _fxm.events || [];
    load('//d35tca7vmefkrc.cloudfront.net/scripts/' + options.appId + '.js');

    // FoxMetrics makes a queue, so it's ready immediately.
    ready();
  },

  identify : function (userId, traits) {
    // A `userId` is required for profile updates, otherwise its a waste of
    // resources as nothing will get updated.
    if (!userId) return;

    // FoxMetrics needs the first and last name seperately.
    var firstName = null
      , lastName  = null
      , email     = null;

    if (traits && traits.name) {
      firstName = traits.name.split(' ')[0];
      lastName = traits.name.split(' ')[1];
    }
    if (traits && traits.email) {
      email = traits.email;
    }

    // We should probably remove name and email before passing as attributes.
    window._fxm.push([
      '_fxm.visitor.profile',
      userId,        // user id
      firstName,     // first name
      lastName,      // last name
      email,         // email
      null,          // address
      null,          // social
      null,          // partners
      traits || null // attributes
    ]);
  },

  track : function (event, properties) {
    window._fxm.push([
      event,     // event name
      null,      // category
      properties // properties
    ]);
  },

  pageview : function (url) {
    window._fxm.push([
      '_fxm.pages.view',
      null,        // title
      null,        // name
      null,        // category
      url || null, // url
      null         // referrer
    ]);
  }

});
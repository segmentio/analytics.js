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
    // A `userId` is required for profile updates.
    if (!userId) return;

    // FoxMetrics needs the first and last name seperately. Fallback to
    // splitting the `name` trait if we don't have what we need.
    var firstName = traits.firstName
      , lastName  = traits.lastName;

    if (!firstName && traits.name) firstName = traits.name.split(' ')[0];
    if (!lastName && traits.name)  lastName  = traits.name.split(' ')[1];

    window._fxm.push([
      '_fxm.visitor.profile',
      userId,         // user id
      firstName,      // first name
      lastName,       // last name
      traits.email,   // email
      traits.address, // address
      undefined,      // social
      undefined,      // partners
      traits          // attributes
    ]);
  },

  track : function (event, properties) {
    window._fxm.push([
      event,               // event name
      properties.category, // category
      properties           // properties
    ]);
  },

  pageview : function (url) {
    window._fxm.push([
      '_fxm.pages.view',
      undefined, // title
      undefined, // name
      undefined, // category
      url,       // url
      undefined  // referrer
    ]);
  }

});
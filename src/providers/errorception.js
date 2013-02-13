// Errorception
// ------------
// [Documentation](http://errorception.com/).

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'projectId',

  options : {
    projectId : null,

    // Whether to store metadata about the user on `identify` calls, using
    // the [Errorception `meta` API](http://blog.errorception.com/2012/11/capture-custom-data-with-your-errors.html).
    meta : true
  },


  initialize : function (options) {
    window._errs = window._errs || [options.projectId];
    load('//d15qhc0lu1ghnk.cloudfront.net/beacon.js');

    // Attach the window `onerror` event.
    window.onerror = function () {
      window._errs.push(arguments);
    };
  },


  identify : function (userId, traits) {
    if (!this.options.meta || !traits) return;

    // If the custom metadata object hasn't ever been made, make it.
    window._errs.meta || (window._errs.meta = {});

    // Add all of the traits as metadata.
    extend(window._errs.meta, traits);
  }

});
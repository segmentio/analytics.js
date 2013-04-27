// http://errorception.com/

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script')
  , type     = require('type');


module.exports = Provider.extend({

  name : 'Errorception',

  key : 'projectId',

  defaults : {
    projectId : null,
    // Whether to store metadata about the user on `identify` calls, using
    // the [Errorception `meta` API](http://blog.errorception.com/2012/11/capture-custom-data-with-your-errors.html).
    meta : true
  },

  initialize : function (options, ready) {
    window._errs = window._errs || [options.projectId];
    load('//d15qhc0lu1ghnk.cloudfront.net/beacon.js');

    // Attach the window `onerror` event.
    var oldOnError = window.onerror;
    window.onerror = function () {
      window._errs.push(arguments);
      // Chain the old onerror handler after we finish our work.
      if ('function' === type(oldOnError)) {
        oldOnError.apply(this, arguments);
      }
    };

    // Errorception makes a queue, so it's ready immediately.
    ready();
  },

  // Add the traits to the Errorception meta object.
  identify : function (userId, traits) {
    if (!this.options.meta) return;

    // If the custom metadata object hasn't ever been made, make it.
    window._errs.meta || (window._errs.meta = {});

    // Add `userId` to traits.
    traits || (traits = {});
    if (userId) traits.id = userId;

    // Add all of the traits as metadata.
    extend(window._errs.meta, traits);
  }

});
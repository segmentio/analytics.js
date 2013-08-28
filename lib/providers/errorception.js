// http://errorception.com/

var Provider = require('../provider');
var extend = require('extend');
var load = require('load-script');
var onError = require('on-error');
var type = require('type');


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
    window._errs = [options.projectId];
    onError(function() {
      window._errs.push(arguments);
    });
    load('//beacon.errorception.com/' + options.projectId + '.js');
    ready();
  },

  // Add the traits to the Errorception meta object.
  identify : function (userId, traits) {
    if (!this.options.meta) return;

    // If the custom metadata object hasn't ever been made, make it.
    window._errs.meta || (window._errs.meta = {});

    // Add `userId` to traits.
    traits.id = userId;

    // Add all of the traits as metadata.
    extend(window._errs.meta, traits);
  }

});
// https://www.optimizely.com/docs/api

var each      = require('each')
  , nextTick  = require('next-tick')
  , Provider  = require('../provider');


module.exports = Provider.extend({

  name : 'Optimizely',

  defaults : {
    // Whether to replay variations into other enabled integrations as traits.
    variations : true
  },

  initialize : function (options, ready, analytics) {
    // Create the `optimizely` object in case it doesn't exist already.
    // https://www.optimizely.com/docs/api#function-calls
    window.optimizely = window.optimizely || [];

    // If the `variations` option is true, replay our variations on the next
    // tick to wait for the entire library to be ready for replays.
    if (options.variations) {
      var self = this;
      nextTick(function () { self.replay(); });
    }

    // Optimizely should be on the page already, so it's always ready.
    ready();
  },

  track : function (event, properties) {
    // Optimizely takes revenue as cents, not dollars.
    if (properties && properties.revenue) properties.revenue = properties.revenue * 100;

    window.optimizely.push(['trackEvent', event, properties]);
  },

  replay : function () {
    // Make sure we have access to Optimizely's `data` dictionary.
    var data = window.optimizely.data;
    if (!data) return;

    // Grab a few pieces of data we'll need for replaying.
    var experiments       = data.experiments
      , variationNamesMap = data.state.variationNamesMap;

    // Create our traits object to add variations to.
    var traits = {};

    // Loop through all the experiement the user has been assigned a variation
    // for and add them to our traits.
    each(variationNamesMap, function (experimentId, variation) {
      traits['Experiment: ' + experiments[experimentId].name] = variation;
    });

    this.analytics.identify(traits);
  }

});
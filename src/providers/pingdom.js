var date     = require('load-date')
  , Provider = require('../provider')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'Pingdom',

  key : 'id',

  defaults : {
    id : null
  },

  initialize : function (options, ready) {
    window._prum = { id : options.id };
    window.PRUM_EPISODES = window.PRUM_EPISODES || {};
    window.PRUM_EPISODES.q = [];
    window.PRUM_EPISODES.mark = function(b,a){PRUM_EPISODES.q.push(['mark',b,a||new Date().getTime()])};
    window.PRUM_EPISODES.measure = function(b,a,b){PRUM_EPISODES.q.push(['measure',b,a,b||new Date().getTime()])};
    window.PRUM_EPISODES.done = function(a){PRUM_EPISODES.q.push(['done',a])};

    // In the original snippet they don't pass the time, but
    // since we load this async, we need to pass in the actual start time.
    window.PRUM_EPISODES.mark('firstbyte', date.getTime());

    // We've replaced the original snippet loader with our
    // own load method.
    load('//rum-static.pingdom.net/prum.min.js', ready);
  }

});
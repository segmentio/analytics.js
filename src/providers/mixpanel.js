// Mixpanel
// --------
// [Documentation](https://mixpanel.com/docs/integration-libraries/javascript),
// [documentation](https://mixpanel.com/docs/people-analytics/javascript),
// [documentation](https://mixpanel.com/docs/integration-libraries/javascript-full-api).

var Provider = require('../provider')
  , extend   = require('extend')
  , alias    = require('alias')
  , isEmail  = require('is-email');


module.exports = Provider.extend({

  key : 'token',

  options : {
    // Whether to call `mixpanel.nameTag` on `identify`.
    nameTag : true,
    // Whether to use Mixpanel's People API.
    people : false,
    // The Mixpanel API token for your account.
    token : null,
    // Whether to track pageviews to Mixpanel.
    pageview : false,
    // Whether to track an initial pageview on initialize.
    initialPageview : false
  },

  initialize : function (options, ready) {
    (function (c, a) {
      window.mixpanel = a;
      var b, d, h, e;
      b = c.createElement('script');
      b.type = 'text/javascript';
      b.async = true;
      b.src = ('https:' === c.location.protocol ? 'https:' : 'http:') + '//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';
      d = c.getElementsByTagName('script')[0];
      d.parentNode.insertBefore(b, d);
      a._i = [];
      a.init = function (b, c, f) {
        function d(a, b) {
          var c = b.split('.');
          2 == c.length && (a = a[c[0]], b = c[1]);
          a[b] = function () {
              a.push([b].concat(Array.prototype.slice.call(arguments, 0)));
          };
        }
        var g = a;
        'undefined' !== typeof f ? g = a[f] = [] : f = 'mixpanel';
        g.people = g.people || [];
        h = ['disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'alias', 'name_tag', 'set_config', 'people.set', 'people.increment', 'people.track_charge', 'people.append'];
        for (e = 0; e < h.length; e++) d(g, h[e]);
        a._i.push([b, c, f]);
      };
      a.__SV = 1.2;
    })(document, window.mixpanel || []);

    // Pass options directly to `init` as the second argument.
    window.mixpanel.init(options.token, options);

    if (options.initialPageview) this.pageview();

    // Mixpanel creats all of its methods in the snippet, so it's ready
    // immediately.
    ready();
  },


  identify : function (userId, traits) {
    // If we have an email and no email trait, set the email trait.
    if (userId && isEmail(userId) && (traits && !traits.email)) {
      traits || (traits = {});
      traits.email = userId;
    }

    // Alias the traits' keys with dollar signs for Mixpanel's API.
    if (traits) {
      alias(traits, {
        'created'   : '$created',
        'email'     : '$email',
        'firstName' : '$first_name',
        'lastName'  : '$last_name',
        'lastSeen'  : '$last_seen',
        'name'      : '$name',
        'username'  : '$username'
      });
    }

    // Finally, call all of the identify equivalents. Verify certain calls
    // against options to make sure they're enabled.
    if (userId) {
      window.mixpanel.identify(userId);
      if (this.options.nameTag) window.mixpanel.name_tag(traits && traits.$email || userId);
    }
    if (traits) {
      window.mixpanel.register(traits);
      if (this.options.people) window.mixpanel.people.set(traits);
    }
  },


  track : function (event, properties) {
    window.mixpanel.track(event, properties);

    // Mixpanel handles revenue with a `transaction` call in their People
    // feature. So if we're using people, record a transcation.
    if (properties && properties.revenue && this.options.people) {
      window.mixpanel.people.track_charge(properties.revenue);
    }
  },


  // Mixpanel doesn't actually track the pageviews, but they do show up in the
  // Mixpanel stream.
  pageview : function (url) {
    window.mixpanel.track_pageview(url);

    // If they don't want pageviews tracked, leave now.
    if (!this.options.pageview) return;

    var properties;
    if (url) properties = { url : url };
    this.track('Loaded a Page', properties);
  },


  // Although undocumented, Mixpanel actually supports the `originalId`. It
  // just usually defaults to the current user's `distinct_id`.
  alias : function (newId, originalId) {

    if(window.mixpanel.get_distinct_id &&
       window.mixpanel.get_distinct_id() === newId) return;

    // HACK: internal mixpanel API to ensure we don't overwrite.
    if(window.mixpanel.get_property &&
       window.mixpanel.get_property('$people_distinct_id')) return;

    window.mixpanel.alias(newId, originalId);
  }

});
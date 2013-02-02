// Mixpanel
// --------
// [Documentation](https://mixpanel.com/docs/integration-libraries/javascript),
// [documentation](https://mixpanel.com/docs/people-analytics/javascript),
// [documentation](https://mixpanel.com/docs/integration-libraries/javascript-full-api).

analytics.addProvider('Mixpanel', {

    settings : {
        // Whether to call `mixpanel.nameTag` on `identify`.
        nameTag : true,
        // Whether to use Mixpanel's People API.
        people  : false,
        token   : null
    },


    // Initialize
    // ----------

    // Changes to the Mixpanel snippet:
    //
    // * Use window for call to `init`.
    // * Add `token` and `settings` args to call to `init`.
    //
    // We don't need to set the `mixpanel` object on `window` ourselves because
    // they already do that.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'token');
        analytics.utils.extend(this.settings, settings);

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
                h = ['disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'alias', 'name_tag', 'set_config', 'people.set', 'people.increment'];
                for (e = 0; e < h.length; e++) d(g, h[e]);
                a._i.push([b, c, f]);
            };
            a.__SV = 1.2;
        })(document, window.mixpanel || []);

        // Pass settings directly to `init` as the second argument.
        window.mixpanel.init(this.settings.token, this.settings);
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        // If we have an email and no email trait, set the email trait.
        if (userId && analytics.utils.isEmail(userId) && (traits && !traits.email)) {
            traits || (traits = {});
            traits.email = userId;
        }

        // Alias the traits' keys with dollar signs for Mixpanel's API.
        if (traits) {
            analytics.utils.alias(traits, {
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
        // against settings to make sure they're enabled.
        if (userId) {
            window.mixpanel.identify(userId);
            if (this.settings.nameTag) window.mixpanel.name_tag(traits && traits.$email || userId);
        }
        if (traits) {
            window.mixpanel.register(traits);
            if (this.settings.people) window.mixpanel.people.set(traits);
        }
    },


    // Track
    // -----

    track : function (event, properties) {
        window.mixpanel.track(event, properties);

        // Mixpanel handles revenue with a `transaction` call in their People
        // feature. So if we're using people, record a transcation.
        if (properties && properties.revenue && this.settings.people) {
            window.mixpanel.people.track_charge(properties.revenue);
        }
    },


    // Pageview
    // --------

    // Mixpanel doesn't actually track the pageviews, but they do show up in the
    // Mixpanel stream.
    pageview : function (url) {
        window.mixpanel.track_pageview(url);
    },


    // Alias
    // -----

    // Although undocumented, Mixpanel actually supports the `originalId`. It
    // just usually defaults to the current user's `distinct_id`.
    alias : function (newId, originalId) {
        window.mixpanel.alias(newId, originalId);
    }

});



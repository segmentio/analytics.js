// GoSquared
// ---------
// [Documentation](www.gosquared.com/support).
// Will automatically [integrate with Olark](https://www.gosquared.com/support/articles/721791-setting-up-olark-live-chat).

analytics.addProvider('GoSquared', {

    settings : {
        siteToken : null
    },


    // Initialize
    // ----------

    // Changes to the GoSquared tracking code:
    //
    // * Use `siteToken` from settings.
    // * No longer need to wait for pageload, removed unnecessary functions.
    // * Attach `GoSquared` to `window`.

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteToken');
        analytics.utils.extend(this.settings, settings);

        var GoSquared = window.GoSquared = {};
        GoSquared.acct = this.settings.siteToken;
        window._gstc_lt =+ (new Date);
        var d = document;
        var g = d.createElement('script');
        g.type = 'text/javascript';
        g.async = true;
        var protocol = (('https:' == document.location.protocol) ? 'https:' : 'http:');
        g.src = protocol + '//d1l6p2sc9645hc.cloudfront.net/tracker.js';
        var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(g, s);
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        // TODO figure out if this will actually work. Seems like GoSquared will
        // never know these values are updated.
        if (userId) window.GoSquared.UserName = userId;
        if (traits) window.GoSquared.Visitor = traits;
    },


    // Track
    // -----

    track : function (event, properties) {
        // The queue isn't automatically created by the snippet.
        if (!window.GoSquared.q) window.GoSquared.q = [];

        // GoSquared sets a `gs_evt_name` property with a value of the event
        // name, so it relies on properties being an object.
        properties || (properties = {});

        window.GoSquared.q.push(['TrackEvent', event, properties]);
    },


    // Pageview
    // --------

    pageview : function () {
        window.GoSquared.DefaultTracker.TrackView();
    }

});



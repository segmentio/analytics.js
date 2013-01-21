// Clicky
// ------
// [Documentation](http://clicky.com/help/customization/manual?new-domain).

analytics.addProvider('Clicky', {

    settings : {
        siteId : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteId');
        analytics.utils.extend(this.settings, settings);

        var clicky_site_ids = window.clicky_site_ids = window.clicky_site_ids || [];
        clicky_site_ids.push(settings.siteId);

        (function() {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            var protocol = ('https:' == document.location.protocol) ? 'https:' : 'http:';
            s.src = protocol + '//static.getclicky.com/js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(s);
        })();
    },


    // Track
    // -----

    track : function (event, properties) {
        // We aren't guaranteed `clicky` is available until the script has been
        // requested and run, hence the check.
        if (window.clicky) window.clicky.log(window.location.href, event);
    }

});



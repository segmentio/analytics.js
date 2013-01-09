// Gaug.es
// -------
// [Documentation](http://get.gaug.es/documentation/tracking/).

analytics.addProvider('Gaug.es', {

    settings: {
        siteId: null
    },


    // Initialize
    // ----------

    initialize : function(settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteId');
        analytics.utils.extend(this.settings, settings);

        var _gauges = _gauges || [];

        (function() {
            var t   = document.createElement('script');
            t.type  = 'text/javascript';
            t.async = true;
            t.id    = 'gauges-tracker';
            t.setAttribute('data-site-id', settings.siteId);
            t.src = '//secure.gaug.es/track.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(t, s);
          })();

        window._gauges = _gauges;
    },


    // Pageview
    // --------

    pageview : function() {
        window._gauges.push(['track']);
    }

});

// Google Analytics
// ----------------
// Last updated: October 31st, 2012
// [Documentation](https://developers.google.com/analytics/devguides/collection/gajs/).

analytics.addProvider('Google Analytics', {

    // Changes to the Google Analytics snippet:
    //
    // * Added `trackingId`.
    // * Added optional support for `enhancedLinkAttribution`
    // * Added optional support for `siteSpeedSampleRate`
    // * Added optional support for `anonymizeIp`
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'trackingId');

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', settings.trackingId]);
        if (settings.enhancedLinkAttribution) {
            var pluginUrl = (('https:' == document.location.protocol) ? 'https://ssl.' : 'http://www.') + 'google-analytics.com/plugins/ga/inpage_linkid.js';
            _gaq.push(['_require', 'inpage_linkid', pluginUrl]);
        }
        if (analytics.utils.isNumber(settings.siteSpeedSampleRate)) {
            _gaq.push(['_setSiteSpeedSampleRate', settings.siteSpeedSampleRate]);
        }
        if(settings.anonymizeIp) {
            _gaq.push(['_gat._anonymizeIp']);
        }
        _gaq.push(['_trackPageview']);
        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

        window._gaq = _gaq;
    },

    track : function (event, properties) {
        window._gaq.push(['_trackEvent', 'All', event]);
    }

});



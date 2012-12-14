
// Google Analytics
// ----------------
// Last updated: October 31st, 2012
// [Documentation](https://developers.google.com/analytics/devguides/collection/gajs/).
module.exports = {

    // Changes to the Google Analytics snippet:
    //
    // * Added optional support for `enhancedLinkAttribution`
    // * Added optional support for `siteSpeedSampleRate`
    // * Added optional support for `anonymizeIp`
    // * Add `apiKey` to call to `_setAccount`.
    initialize : function (settings) {
        this.settings = settings;

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', settings.trackingId]);

        if (this.settings.enhancedLinkAttribution === true) {
            var pluginUrl = (('https:' == document.location.protocol) ? 'https://ssl.' : 'http://www.') + 'google-analytics.com/plugins/ga/inpage_linkid.js';
            _gaq.push(['_require', 'inpage_linkid', pluginUrl]);
        }
        if (this.settings.siteSpeedSampleRate != null &&
            typeof(this.settings.siteSpeedSampleRate) === 'number') {
            _gaq.push(['_setSiteSpeedSampleRate', this.settings.siteSpeedSampleRate]);
        }
        if(this.settings.anonymizeIp === true) {
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
    },

    keyField: 'trackingId'
};


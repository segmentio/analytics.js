// Google Analytics
// ----------------
// [Documentation](https://developers.google.com/analytics/devguides/collection/gajs/).

analytics.addProvider('Google Analytics', {

    settings : {
        anonymizeIp             : false,
        enhancedLinkAttribution : false,
        siteSpeedSampleRate     : null,
        domain                  : null,
        trackingId              : null
    },


    // Initialize
    // ----------

    // Changes to the Google Analytics snippet:
    //
    // * Added `trackingId`.
    // * Added optional support for `enhancedLinkAttribution`
    // * Added optional support for `siteSpeedSampleRate`
    // * Added optional support for `anonymizeIp`
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'trackingId');
        analytics.utils.extend(this.settings, settings);

        var _gaq = window._gaq = window._gaq || [];
        _gaq.push(['_setAccount', this.settings.trackingId]);
        if(this.settings.domain) {
            _gaq.push(['_setDomainName', this.settings.domain]);
        }
        if (this.settings.enhancedLinkAttribution) {
            var pluginUrl = (('https:' === document.location.protocol) ? 'https://www.' : 'http://www.') + 'google-analytics.com/plugins/ga/inpage_linkid.js';
            _gaq.push(['_require', 'inpage_linkid', pluginUrl]);
        }
        if (analytics.utils.isNumber(this.settings.siteSpeedSampleRate)) {
            _gaq.push(['_setSiteSpeedSampleRate', this.settings.siteSpeedSampleRate]);
        }
        if(this.settings.anonymizeIp) {
            _gaq.push(['_gat._anonymizeIp']);
        }

        // Check to see if there is a canonical meta tag to use as the URL.
        var canonicalUrl, metaTags = document.getElementsByTagName('meta');
        for (var i = 0, tag; tag = metaTags[i]; i++) {
            if (tag.getAttribute('rel') === 'canonical') {
                canonicalUrl = analytics.utils.parseUrl(tag.getAttribute('href')).pathname;
            }
        }
        _gaq.push(['_trackPageview', canonicalUrl]);

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    },


    // Track
    // -----

    track : function (event, properties) {
        properties || (properties = {});

        var value;

        // Since value is a common property name, ensure it is a number
        if (analytics.utils.isNumber(properties.value)) value = properties.value;

        // Try to check for a `category` and `label`. A `category` is required,
        // so if it's not there we use `'All'` as a default. We can safely push
        // undefined if the special properties don't exist. Try using revenue
        // first, but fall back to a generic `value` as well.
        window._gaq.push([
            '_trackEvent',
            properties.category || 'All',
            event,
            properties.label,
            Math.round(properties.revenue) || value,
            properties.noninteraction
        ]);
    },


    // Pageview
    // --------

    pageview : function (url) {
        // If there isn't a url, that's fine.
        window._gaq.push(['_trackPageview', url]);
    }

});



// Comscore
// ---------
// [Documentation](http://direct.comscore.com/clients/help/FAQ.aspx#faqTagging)

analytics.addProvider('Comscore', {

    settings : {
        c1 : '2',
        c2 : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'c2');
        analytics.utils.extend(this.settings, settings);

        var _comscore = window._comscore = window._comscore || [];
        _comscore.push(this.settings);

        (function() {
            var s = document.createElement("script");
            var el = document.getElementsByTagName("script")[0];
            s.async = true;
            s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";
            el.parentNode.insertBefore(s, el);
        })();

        // NOTE: the <noscript><img> bit in the docs is ignored
        // because we have to run JS in order to do any of this!
    }

});


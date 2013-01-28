// USERcycle
// -----------
// [Documentation](http://docs.usercycle.com/javascript_api).

analytics.addProvider('USERcycle', {

    settings : {
        key : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'key');
        analytics.utils.extend(this.settings, settings);

        var _uc = window._uc = window._uc || [];
        (function(){
            var e = document.createElement('script');
            e.setAttribute('type', 'text/javascript');
            var protocol = 'https:' == document.location.protocol ? 'https://' : 'http://';
            e.setAttribute('src', protocol+'api.usercycle.com/javascripts/track.js');
            var f = document.getElementsByTagName('script')[0];
            f.parentNode.insertBefore(e, f);
        })();

        window._uc.push(['_key', settings.key]);
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        if (userId) window._uc.push(['uid', userId, traits]);
    },


    // Track
    // -----

    track : function (event, properties) {
        window._uc.push(['action', event, properties]);
    }

});



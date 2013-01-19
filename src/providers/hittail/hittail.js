// HitTail
// -------
// [Documentation](www.hittail.com).

analytics.addProvider('HitTail', {

    settings : {
        siteId : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteId');
        analytics.utils.extend(this.settings, settings);

        var siteId = settings.siteId;
        (function(){
            var ht = document.createElement('script');
            ht.async = true;
            ht.type = 'text/javascript';
            ht.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + siteId + '.hittail.com/mlt.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ht, s);
        })();
    }

});



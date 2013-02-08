// UserVoice
// ---------
// [Documentation](http://www.livechatinc.com/api/javascript-api).

analytics.addProvider('UserVoice', {

    settings : {
        siteId : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteId');
        analytics.utils.extend(this.settings, settings);

        window.uvOptions = {};
        (function() {
            var uv = document.createElement('script'); uv.type = 'text/javascript'; uv.async = true;
            uv.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'widget.uservoice.com/' + settings.siteId + '.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(uv, s);
        })();
    }

});



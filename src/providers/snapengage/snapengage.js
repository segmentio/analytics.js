// SnapEngage
// ----------
// [Documentation](http://help.snapengage.com/installation-guide-getting-started-in-a-snap/).

analytics.addProvider('SnapEngage', {

    settings : {
        apiKey : null
    },


    // Initialize
    // ----------

    // Changes to the SnapEngage snippet:
    //
    // * Add `apiKey` from stored `settings`.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'apiKey');
        analytics.utils.extend(this.settings, settings);

        var self = this;
        (function() {
            var se = document.createElement('script');
            se.type = 'text/javascript';
            se.async = true;
            var protocol = ('https:' == document.location.protocol) ? 'https:' : 'http:';
            se.src = protocol + '//commondatastorage.googleapis.com/code.snapengage.com/js/'+self.settings.apiKey+'.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(se, s);
        })();
    }

});



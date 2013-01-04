// Errorception
// ------------
// [Documentation](http://errorception.com/).

analytics.addProvider('Errorception', {

    settings : {
        projectId : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'projectId');
        analytics.utils.extend(this.settings, settings);

        var self = this;

        var _errs = window._errs = _errs || [settings.projectId];
        (function(a,b){
            a.onerror = function () {
                _errs.push(arguments);
            };
            var d = function () {
                var a = b.createElement("script"),
                    c = b.getElementsByTagName("script")[0];
                a.src = "//d15qhc0lu1ghnk.cloudfront.net/beacon.js";
                a.async = true;
                c.parentNode.insertBefore(a,c);
            };
            a.addEventListener ? a.addEventListener("load",d,!1) : a.attachEvent("onload",d);
        })(window,document);
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        // noop
    },


    // Track
    // -----

    track : function (event, properties) {
        // noop
    }

});



// Yandex.Metrika
// ----------------
// [Documentation](http://help.yandex.ru/metrika/?id=1113052).

analytics.addProvider('Yandex.Metrika', {

    settings : {
        id                 : null,
        webvisor           : true,
        clickmap           : true,
        trackLinks         : true,
        accurateTrackBounce: true,
        ut                 : 'noindex',
        trackHash          : false
    },

    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'id');
        analytics.utils.extend(this.settings, settings);

        var that = this;
        (function (d, w, c) {
            (w[c] = w[c] || []).push(function() {
                try {
                    w['yaCounter' + that.settings.id] = new Ya.Metrika(that.settings);
                } catch(e) { }
            });

            var n = d.getElementsByTagName("script")[0],
                s = d.createElement("script"),
                f = function () { n.parentNode.insertBefore(s, n); };
            s.type = "text/javascript";
            s.async = true;
            s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

            if (w.opera == "[object Opera]") {
                d.addEventListener("DOMContentLoaded", f, false);
            } else { f(); }
        })(document, window, "yandex_metrika_callbacks");
    },


    // Pageview
    // -----

    pageview : function () {
        var d = document;
        w['yaCounter' + that.settings.id].hit(d.location.href, d.title, d.referrer);
    },

    // Track
    // --------

    track : function (event, properties) {
        w['yaCounter' + that.settings.id].reachGoal(event, properties);
    }

});



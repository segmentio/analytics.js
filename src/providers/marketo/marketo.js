// Marketo
// -------
// [Documentation](https://app-q.marketo.com/)

analytics.addProvider('Marketo', {

    settings : {
        accountId : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'accountId');
        analytics.utils.extend(this.settings, settings);

        (function() {
            var didInit = false;
            function initMunchkin() {
                if (didInit === false) {
                    didInit = true;
                    Munchkin.init(settings.accountId);
                }
            }
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = document.location.protocol + '//munchkin.marketo.net/munchkin.js';
            s.onreadystatechange = function() {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    initMunchkin();
                }
            };
            s.onload = initMunchkin;
            document.getElementsByTagName('head')[0].appendChild(s);
        })();
    }

});



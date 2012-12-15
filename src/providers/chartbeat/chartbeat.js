// Chartbeat
// ---------
// Last updated: November 27th, 2012
// [Documentation](http://chartbeat.com/docs/adding_the_code/),
// [documentation](http://chartbeat.com/docs/configuration_variables/),
// [documentation](http://chartbeat.com/docs/handling_virtual_page_changes/).

analytics.addProvider('Chartbeat', {

    // Changes to the Chartbeat snippet:
    //
    // * Add `apiKey` and `domain` variables to config.
    // * Replaced the date with our stored `date` variable.
    //
    // Also, we don't need to set the `mixpanel` object on `window` because
    // they already do that.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'uid');

        // Since all the custom settings just get passed through, update the
        // Chartbeat `_sf_async_config` variable with settings.
        var _sf_async_config = settings || {};

        (function(){
            // Use the stored date from when we were loaded.
            window._sf_endpt = analytics.date.getTime();
            var e = document.createElement("script");
            e.setAttribute("language", "javascript");
            e.setAttribute("type", "text/javascript");
            e.setAttribute("src",
                (("https:" == document.location.protocol) ?
                    "https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/" :
                    "http://static.chartbeat.com/") +
                "js/chartbeat.js");
            document.body.appendChild(e);
        })();
    }

    // TODO: Add virtual page API.

});



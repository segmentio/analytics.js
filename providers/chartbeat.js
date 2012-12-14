
// Chartbeat
// ---------
// Last updated: November 27th, 2012
// [Documentation](http://chartbeat.com/docs/adding_the_code/),
// [documentation](http://chartbeat.com/docs/configuration_variables/),
// [documentation](http://chartbeat.com/docs/handling_virtual_page_changes/).

// Store the date when the page loaded, for services that depend on it.
// the modules are loaded when they are required
var date = new Date();

module.exports = {
    // Changes to the Chartbeat snippet:
    //
    // * Add `apiKey` and `domain` variables to config.
    // * Added conditionals for extra settings.
    // * Replaced the date with our stored `date` variable.
    // * Dealt with reliance on window.onload, so that Chartbeat can be
    //   initialized after the page has loaded.
    //
    // Also, we don't need to set the `mixpanel` object on `window` because
    // they already do that.
    initialize : function (settings) {
        this.settings = settings;

        var _sf_async_config={};
        /** CONFIGURATION START **/
        _sf_async_config.uid    = settings.uid;
        _sf_async_config.domain = settings.domain || window.location.host;
        if (settings.path)         _sf_async_config.path         = settings.path;
        if (settings.title)        _sf_async_config.title        = settings.title;
        if (settings.useCanonical) _sf_async_config.useCanonical = settings.useCanonical;
        if (settings.sections)     _sf_async_config.sections     = settings.sections;
        if (settings.authors)      _sf_async_config.authors      = settings.authors;
        if (settings.noCookies)    _sf_async_config.noCookies    = settings.noCookies;
        /** CONFIGURATION END **/
        (function(){
            window._sf_endpt = date.getTime();
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
    },

    keyField: 'uid'

    // TODO: Add virtual page API.
};


// CrazyEgg.com
// ----------
// Last updated: December 6th, 2012
// [Documentation](www.crazyegg.com).

analytics.addProvider('CrazyEgg', {

    // Changes to the CrazyEgg snippet:
    //
    // * Concatenate the API key into the URL.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'apiKey');

        (function(){
            var a=document.createElement("script");
            var b=document.getElementsByTagName("script")[0];
            a.src=document.location.protocol+"//dnn506yrbagrg.cloudfront.net/pages/scripts/"+settings.apiKey+".js?"+Math.floor(new Date().getTime()/3600000);
            a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b);
        })();
    }

});



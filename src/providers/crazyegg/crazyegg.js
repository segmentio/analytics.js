// CrazyEgg
// --------
// [Documentation](www.crazyegg.com).

analytics.addProvider('CrazyEgg', {

    settings : {
        accountNumber : null
    },


    // Initialize
    // ----------

    // Changes to the CrazyEgg snippet:
    //
    // * Concatenate `accountNumber` into the URL.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'accountNumber');
        analytics.utils.extend(this.settings, settings);

        var accountNumber = this.settings.accountNumber;
        var accountPath = accountNumber.slice(0, 4) + '/' + accountNumber.slice(4);
        
        (function(){
            var a = document.createElement('script');
            var b = document.getElementsByTagName('script')[0];
            var protocol = ('https:' == document.location.protocol) ? 'https:' : 'http:';
            a.src = protocol+'//dnn506yrbagrg.cloudfront.net/pages/scripts/'+accountPath+'.js?'+Math.floor(new Date().getTime()/3600000);
            a.async = true;
            a.type = 'text/javascript';
            b.parentNode.insertBefore(a,b);
        })();
    }

});



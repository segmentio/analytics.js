availableProviders['KissMetrics'] = {

    initialize : function (settings) {
        var _kmq = _kmq || [];
        window._kmq = _kmq;
        function _kms(u){
            setTimeout(function(){
                var d = document, f = d.getElementsByTagName('script')[0],
                s = d.createElement('script');
                s.type = 'text/javascript'; s.async = true; s.src = u;
                f.parentNode.insertBefore(s, f);
            }, 1);
        }
        _kms('//i.kissmetrics.com/i.js');
        _kms('//doug1izaerwt3.cloudfront.net/' + settings.apiKey + '.1.js');
        _kmq.push(['record', 'Viewed page']);
    },

    identify : function (userId, traits) {
        window._kmq.push(['identify', userId]);
        window._kmq.push(['set', traits]);
    },

    track : function (event, properties) {
        window._kmq.push(['record', event, properties]);
    }
};
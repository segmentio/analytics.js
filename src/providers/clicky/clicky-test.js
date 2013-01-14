!(function () {

    suite('Clicky');


    // Initialize
    // ----------

    test('stores settings and adds clicky.js on initialize', function (callback) {

        // Clicky loads very slowly on travis, so we
        // have to use a slightly different structure.
        this.timeout(8000);
        var loadedCheck;

        function onFinish() {
            expect(window.clicky).to.exist;
            if (loadedCheck) {
                clearInterval(loadedCheck);
                loadedCheck = null;
                callback();
            }
        }

        expect(window.clicky).not.to.exist;

        analytics.initialize({
            'Clicky' : 'x'
        });

        // Check to see whether clicky has loaded.
        // Avoids long timeout when testing locally.
        loadedCheck = setInterval(function () {
            if (window.clicky)
              onFinish();
        }, 500);

        setTimeout(onFinish, 7000);
        expect(analytics.providers[0].settings.siteId).to.equal('x');
    });


    // Pageview
    // --------

    test('sends pageview on pageview');

}());
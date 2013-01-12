!(function () {

    suite('Clicky');


    // Initialize
    // ----------

    test('stores settings and adds clicky.js on initialize', function (callback) {

        expect(window.clicky).not.to.exist;

        // Clicky loads slowly on travis
        this.timeout(8000);

        analytics.initialize({
            'Clicky' : 'x'
        });
        setTimeout(function () {
            expect(window.clicky).to.exist;
            callback();
        }, 7000);
        expect(analytics.providers[0].settings.siteId).to.equal('x');
    });


    // Pageview
    // --------

    test('sends pageview on pageview');

}());
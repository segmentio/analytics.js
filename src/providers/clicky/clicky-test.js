!(function () {

    suite('Clicky');


    // Initialize
    // ----------

    test('stores settings and adds clicky.js on initialize', function (callback) {
        expect(window.clicky).not.to.exist;

        analytics.initialize({
            'Clicky' : 'x'
        });
        setTimeout(function () {
            expect(window.clicky).to.exist;
            callback();
        }, 1500);
        expect(analytics.providers[0].settings.siteId).to.equal('x');
    });


    // Pageview
    // --------

    test('sends pageview on pageview');

}());
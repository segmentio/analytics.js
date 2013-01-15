!(function () {

    suite('Clicky');


    // Initialize
    // ----------

    // Clicky loads very slowly on travis, so we get smart and check it on an
    // interval so that we wait for the shortest time possible.
    test('stores settings and adds clicky.js on initialize', function (done) {
        this.timeout(10000);

        expect(window.clicky).not.to.exist;

        analytics.initialize({
            'Clicky' : 'x'
        });

        var interval = setInterval(function () {
            if (window.clicky) {
                clearInterval(interval);
                expect(window.clicky).to.exist;
                done();
            }
        }, 1000);

        expect(analytics.providers[0].settings.siteId).to.equal('x');
    });


    // Pageview
    // --------

    test('sends pageview on pageview');

}());
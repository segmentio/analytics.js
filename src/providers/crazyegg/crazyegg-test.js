!(function () {

    suite('CrazyEgg');


    // Initialize
    // ----------

    test('stores settings and adds javascript on initialize', function () {
        expect(window.CE2).to.be(undefined);

        analytics.initialize({
            'CrazyEgg' : '0013/8301'
        });
        expect(analytics.providers[0].settings.apiKey).to.equal('0013/8301');

        // CrazyEgg seems to block requesting their script from localhost, so
        // not much we can do here for now.
    });

}());
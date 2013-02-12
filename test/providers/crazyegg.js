!(function () {

    suite('CrazyEgg');


    // Initialize
    // ----------

    test('stores settings and adds javascript on initialize', function () {
        expect(window.CE2).to.be(undefined);

        analytics.initialize({
            'CrazyEgg' : '00138301'
        });
        expect(analytics.providers[0].settings.accountNumber).to.equal('00138301');

        // CrazyEgg seems to block requesting their script from localhost, so
        // not much we can do here for now.

        // expect(window.CE2).to.be(undefined);
        // setTimeout(function () {
        //     expect(window.CE2).not.to.be(undefined);
        //     done();
        // }, 1000);
    });

}());
!(function () {

    suite('CrazyEgg');

    var options = {
        'CrazyEgg' : '00138301'
    };

    // Initialize
    // ----------

    test('stores options and adds javascript on initialize', function () {
        expect(window.CE2).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);

        // CrazyEgg seems to block requesting their script from localhost, so
        // not much we can do here for now.
        //
        // expect(window.CE2).to.be(undefined);
        // setTimeout(function () {
        //     expect(window.CE2).not.to.be(undefined);
        //     expect(spy.called).to.be(true);
        //     done();
        // }, 1900);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.accountNumber).to.equal('00138301');
    });

}());
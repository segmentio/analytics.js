!(function () {

    suite('Quantcast');

    var options = { 'Quantcast' : 'x' };


    // Initialize
    // ----------

    test('calls ready and loads the library on initialize', function (done) {
        expect(window._qevents).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);

        setTimeout(function () {
            expect(window._qevents).not.to.be(undefined);
            expect(spy.called).to.be(true);
            done();
        }, 1900);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.pCode).to.equal('x');
    });

}());
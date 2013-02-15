!(function () {

    suite('HitTail');

    var options = {
        'HitTail' : 'x'
    };

    // Initialize
    // ----------

    test('calls ready and loads library on initialize', function (done) {
        expect(window.htk).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);

        // We have to wait for the mlt.js to come back and create the
        // global variable on window...
        setTimeout(function () {
            expect(window.htk).not.to.be(undefined);
            expect(spy.called).to.be(true);
            done();
        }, 1900);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.siteId).to.equal('x');
    });

}());

!(function () {

    suite('comScore');

    var options = {
        'comScore' : {
            c2 : 'x'
        }
    };


    // Initialize
    // ----------

    test('stores options and adds beacon.js on initialize', function (done) {
        expect(window._comscore).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);
        expect(window._comscore).not.to.be(undefined);

        // Wait for the library to load for ready to be called.
        setTimeout(function () {
            expect(spy.called).to.be(true);
            done();
        }, 1900);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(window._comscore[0].c1).to.equal('2');
        expect(window._comscore[0].c2).to.equal('x');
        expect(analytics.providers[0].options.c1).to.equal('2');
        expect(analytics.providers[0].options.c2).to.equal('x');
    });

}());
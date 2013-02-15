!(function () {

    suite('Gauges');

    var options = { 'Gauges' : 'x' };


    // Initialize
    // ----------

    test('stores options and adds gaug.es javascript on initialize', function (done) {
        expect(window._gauges).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);
        expect(window._gauges).not.to.be(undefined);
        expect(window._gauges.push).to.eql(Array.prototype.push);
        expect(spy.called).to.be(true);

        setTimeout(function () {
            expect(window._gauges.push).not.to.eql(Array.prototype.push);
            done();
        }, 1900);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.siteId).to.equal('x');
    });


    // Pageview
    // --------

    test('pushes "track" on pageview', function () {
        var stub = sinon.stub(window._gauges, 'push');

        analytics.pageview();

        expect(stub.calledWith(['track'])).to.be(true);

        stub.restore();
    });

}());
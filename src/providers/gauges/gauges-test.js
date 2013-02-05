!(function () {

    suite('Gauges');


    // Initialize
    // ----------

    test('stores settings and adds gaug.es javascript on initialize', function (done) {
        expect(window._gauges).to.be(undefined);

        analytics.initialize({ 'Gauges' : 'x' });

        expect(window._gauges).not.to.be(undefined);
        expect(analytics.providers[0].settings.siteId).to.equal('x');
        expect(window._gauges.push).to.eql(Array.prototype.push);

        setTimeout(function () {
            expect(window._gauges.push).not.to.eql(Array.prototype.push);
            done();
        }, 1900);
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
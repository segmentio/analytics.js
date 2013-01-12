!(function () {

    suite('Gauges');


    // Initialize
    // ----------

    test('stores settings and adds gaug.es javascript on initialize', function () {
        expect(window._gauges).not.to.exist;

        analytics.initialize({
            'Gauges' : 'x'
        });
        expect(window._gauges).to.exist;
        expect(analytics.providers[0].settings.siteId).to.equal('x');
    });


    // Pageview
    // --------

    test('pushes "track" on pageview', function () {
        var spy = sinon.spy(window._gauges, 'push');
        analytics.pageview();
        expect(spy).to.have.been.calledWith(['track']);

        spy.restore();
    });

}());
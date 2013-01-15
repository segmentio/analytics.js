!(function () {

    suite('Chartbeat');


    // Initialize
    // ----------

    test('stores settings and adds chartbeat.js on initialize', function (done) {
        expect(window.pSUPERFLY).not.to.exist;

        analytics.initialize({
            'Chartbeat' : {
                uid    : 'x',
                domain : 'example.com'
            }
        });

        expect(analytics.providers[0].settings.uid).to.equal('x');
        expect(analytics.providers[0].settings.domain).to.equal('example.com');

        // We have to wait for the charbeat.js to come back and create the
        // global variable on window...
        var self = this;
        setTimeout(function () {
            expect(window.pSUPERFLY).to.exist;
            expect(window._sf_async_config).to.equal(analytics.providers[0].settings);
            done();
        }, 500);
    });


    // Pageview
    // --------

    test('calls virtualPage on pageview', function () {
        var spy = sinon.spy(window.pSUPERFLY, 'virtualPage');
        analytics.pageview();
        expect(spy).to.have.been.calledWith(window.location.pathname);

        spy.reset();
        analytics.pageview('/url');
        expect(spy).to.have.been.calledWith('/url');

        spy.restore();
    });

}());
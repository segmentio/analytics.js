!(function () {

    suite('Chartbeat');


    // Initialize
    // ----------

    test('stores settings and adds chartbeat.js on initialize', function (done) {
        expect(window.pSUPERFLY).to.be(undefined);

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
            expect(window.pSUPERFLY).not.to.be(undefined);
            expect(window._sf_async_config).to.equal(analytics.providers[0].settings);
            done();
        }, 1900);
    });


    // Pageview
    // --------

    test('calls virtualPage on pageview', function () {
        var spy = sinon.spy(window.pSUPERFLY, 'virtualPage');
        analytics.pageview();
        expect(spy.calledWith(window.location.pathname)).to.be(true);

        spy.reset();
        analytics.pageview('/url');
        expect(spy.calledWith('/url')).to.be(true);

        spy.restore();
    });

}());
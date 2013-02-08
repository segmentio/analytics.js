!(function () {

    suite('Perfect Audience');

    var siteId = '4ff6ade4361ed500020000a5';

    var event = 'event';

    var properties = {
        orderId : 12345,
        revenue : "19.99"
    };


    // Initialize
    // ----------

    test('stores settings and adds perfectaudience.js on initialize', function (done) {
        expect(window._pa).to.be(undefined);

        analytics.initialize({ 'Perfect Audience' : siteId });

        expect(window._pa).not.to.be(undefined);
        expect(analytics.providers[0].settings.siteId).to.equal(siteId);

        // Test to make sure the library _actually_ loads.
        setTimeout(function () {
            expect(window._pa.track).not.to.be(undefined);
            done();
        }, 1900);
    });


    // Track
    // -----

    test('calls track on track', function () {
        var spy = sinon.spy(window._pa, 'track');
        analytics.track(event, properties);
        expect(spy.calledWith(event, sinon.match(properties))).to.be(true);

        spy.restore();
    });

}());
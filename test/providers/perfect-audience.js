!(function () {

    suite('Perfect Audience');

    var options = { 'Perfect Audience' : '4ff6ade4361ed500020000a5' };

    var event = 'event';

    var properties = {
        orderId : 12345,
        revenue : "19.99"
    };


    // Initialize
    // ----------

    test('calls ready and loads library on initialize', function (done) {
        expect(window._pa).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);
        expect(window._pa).not.to.be(undefined);

        // Test to make sure the library _actually_ loads.
        setTimeout(function () {
            expect(window._pa.track).not.to.be(undefined);
            expect(spy.called).to.be(true);
            done();
        }, 1900);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.siteId).to.equal('4ff6ade4361ed500020000a5');
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
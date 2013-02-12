!(function () {

    suite('HubSpot');

    var event = 'event';

    var properties = {
        count : 42
    };

    var userId = 'user';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@segment.io'
    };


    // Initialize
    // ----------

    test('stores settings and adds hubspot js on initialize', function (done) {
        expect(window._hsq).to.be(undefined);

        analytics.initialize({
            'HubSpot' : 'x'
        });
        expect(window._hsq).not.to.be(undefined);
        expect(window._hsq.push).to.equal(Array.prototype.push);
        expect(analytics.providers[0].settings.portalId).to.equal('x');

        // Once the hubspot JS file comes back, the array should be transformed.
        var self = this;
        setTimeout(function () {
            expect(window._hsq).not.to.be(undefined);
            expect(window._hsq).to.not.equal(Array.prototype.push);
            done();
        }, 1900);
    });


    // Identify
    // --------

    test('pushes "identify" on identify', function () {
        var spy = sinon.spy(window._hsq, 'push');
        analytics.identify(traits);
        expect(spy.calledWith(['identify', traits])).to.be(true);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWith(['identify', userId])).to.be(false);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(['identify', traits])).to.be(true);

        spy.restore();
    });


    // Track
    // -----

    test('pushes "trackEvent" on track', function () {
        var spy = sinon.spy(window._hsq, 'push');
        analytics.track(event, properties);
        expect(spy.calledWith(['trackEvent', event, properties])).to.be(true);
    });

}());
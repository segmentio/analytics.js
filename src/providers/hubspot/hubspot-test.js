/*global sinon, suite, beforeEach, test, expect, analytics */
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
        expect(window._hsq).not.to.exist;

        analytics.initialize({
            'HubSpot' : 'x'
        });
        expect(window._hsq).to.exist;
        expect(window._hsq.push).to.equal(Array.prototype.push);
        expect(analytics.providers[0].settings.portalId).to.equal('x');

        // Once the hubspot JS file comes back, the array should be transformed.
        var self = this;
        setTimeout(function () {
            expect(window._hsq).to.exist;
            expect(window._hsq).to.not.equal(Array.prototype.push);
            done();
        }, 100);
    });


    // Identify
    // --------

    test('pushes "identify" on identify', function () {
        var spy = sinon.spy(window._hsq, 'push');
        analytics.identify(traits);
        expect(spy).to.have.been.calledWith(['identify', traits]);

        spy.reset();
        analytics.identify(userId);
        expect(spy).to.not.have.been.calledWith(['identify', userId]);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith(['identify', traits]);

        spy.restore();
    });


    // Track
    // -----

    test('pushes "trackEvent" on track', function () {
        var spy = sinon.spy(window._hsq, 'push');
        analytics.track(event, properties);
        expect(spy).to.have.been.calledWith(['trackEvent', event, properties]);
    });

}());
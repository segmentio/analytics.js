!(function () {

    suite('Klaviyo');

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

    test('stores settings and adds kissmetrics javascript on initialize', function () {
        expect(window._learnq).not.to.exist;

        analytics.initialize({
            'Klaviyo' : 'x'
        });
        expect(window._learnq).to.exist;
        expect(analytics.providers[0].settings.apiKey).to.equal('x');
    });


    // Identify
    // --------

    test('pushes "_identify" on identify', function () {
        var spy = sinon.spy(window._learnq, 'push');
        analytics.identify(traits);
        expect(spy).to.have.been.calledWith(['identify', traits]);

        spy.reset();
        analytics.identify(userId);
        expect(spy).to.have.been.calledWith(['identify', { $id: userId }]);

        spy.reset();
        var augmentedTraits = _.extend({}, traits, { $id: userId });
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith(['identify', augmentedTraits]);

        spy.restore();
    });


    // Track
    // -----

    test('pushes "_track" on track', function () {
        var spy = sinon.spy(window._learnq, 'push');
        analytics.track(event, properties);
        // Klaviyo adds extra properites to the event, so we don't want to check
        // for an exact match.
        expect(spy).to.have.been.calledWithMatch(['track', event, sinon.match(properties)]);

        spy.restore();
    });

}());
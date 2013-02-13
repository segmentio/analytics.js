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

    test('stores options and adds klaviyo javascript on initialize', function () {
        expect(window._learnq).to.be(undefined);

        analytics.initialize({
            'Klaviyo' : 'x'
        });
        expect(window._learnq).not.to.be(undefined);
        expect(analytics.providers[0].options.apiKey).to.equal('x');
    });


    // Identify
    // --------

    test('pushes "_identify" on identify', function () {
        var spy = sinon.spy(window._learnq, 'push');
        analytics.identify(traits);
        expect(spy.calledWith(['identify', traits])).to.be(true);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWith(['identify', { $id: userId }])).to.be(true);

        spy.reset();
        var augmentedTraits = _.extend({}, traits, { $id: userId });
        analytics.identify(userId, traits);
        expect(spy.calledWith(['identify', augmentedTraits])).to.be(true);

        spy.restore();
    });


    // Track
    // -----

    test('pushes "_track" on track', function () {
        var spy = sinon.spy(window._learnq, 'push');
        analytics.track(event, properties);
        // Klaviyo adds extra properites to the event, so we don't want to check
        // for an exact match.
        expect(spy.calledWithMatch(['track', event, sinon.match(properties)])).to.be(true);

        spy.restore();
    });

}());
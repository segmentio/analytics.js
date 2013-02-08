!(function () {

    suite('Woopra');

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


    test('stores settings and loads Woopra js on initialize', function (done) {
        expect(window.woopraReady).to.be(undefined);
        expect(window.woopraTracker).to.be(undefined);

        analytics.initialize({'Woopra' : 'x'});

        expect(window.woopraReady).not.to.be(undefined);
        expect(window.woopraTracker).to.be(undefined);
        expect(analytics.providers[0].settings.domain).to.equal('x');

        setTimeout(function () {
        expect(window.woopraTracker).not.to.be(undefined);
            done();
        }, 1900);
    });


    // Identify
    // --------

    test('correctly identifies the user');


    // Track
    // -----

    // Woopra adds the event name to the properties hash.
    test('tracks an event with pushEvent on track', function () {
        var spy = sinon.spy(window.woopraTracker, 'pushEvent');
        analytics.track(event);

        var augmentedProperties = { name: event };
        expect(spy.calledWith(sinon.match(augmentedProperties))).to.be(true);

        spy.reset();

        analytics.track(event, properties);

        augmentedProperties = _.extend({}, properties, { name: event });
        expect(spy.calledWith(sinon.match(augmentedProperties))).to.be(true);

        spy.restore();
    });

}());
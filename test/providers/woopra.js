var analytics = require('analytics')
  , extend    = require('segmentio-extend');

!(function () {

    suite('Woopra');

    var options = { 'Woopra' : 'x' };

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

    test('stores options and loads Woopra js on initialize', function (done) {
        expect(window.woopraReady).to.be(undefined);
        expect(window.woopraTracker).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);
        expect(window.woopraReady).not.to.be(undefined);
        expect(window.woopraTracker).to.be(undefined);

        // Once the library loads the tracker will be created and the spy will
        // be called.
        setTimeout(function () {
        expect(window.woopraTracker).not.to.be(undefined);
            done();
            expect(spy.called).to.be(true);
        }, 1900);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.domain).to.equal('x');
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

        augmentedProperties = extend({}, properties, { name: event });
        expect(spy.calledWith(sinon.match(augmentedProperties))).to.be(true);

        spy.restore();
    });

}());
/*global sinon, suite, beforeEach, test, expect, analytics */
!(function () {

    suite('GoSquared');

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

    test('stores settings and adds GoSquared js on initialize', function () {
        expect(window.GoSquared).not.to.exist;

        analytics.initialize({
            'GoSquared' : 'x'
        });
        expect(window.GoSquared).to.exist;
        expect(analytics.providers[0].settings.siteToken).to.equal('x');
    });

    test('GoSquared tracker finishes loading', function (done) {
        // use the GoSquared.load function...
        window.GoSquared.load = function(tracker) {
            expect(window.GoSquared.DefaultTracker).to.equal(tracker);
            done();
        };
    });


    // Identify
    // --------

    test('correctly identifies the user', function () {
        expect(window.GoSquared.UserName).not.to.exist;
        expect(window.GoSquared.Visitor).not.to.exist;

        analytics.identify(traits);
        expect(window.GoSquared.UserName).not.to.exist;
        expect(window.GoSquared.Visitor).to.deep.equal(traits);

        window.GoSquared.Visitor = undefined;
        analytics.identify(userId);
        expect(window.GoSquared.UserName).to.equal(userId);
        expect(window.GoSquared.Visitor).not.to.exist;

        window.GoSquared.UserName = undefined;
        analytics.identify(userId, traits);
        expect(window.GoSquared.UserName).to.equal(userId);
        expect(window.GoSquared.Visitor).to.deep.equal(traits);
    });


    // Track
    // -----

    test('pushes "TrackEvent" on track', function () {
        var spy = sinon.spy(window.GoSquared.q, 'push');
        analytics.track(event);
        // GoSquared adds the event name to the properties hash.
        var augmentedProperties = { gs_evt_name: event };
        expect(spy).to.have.been.calledWith([event, sinon.match(augmentedProperties)]);

        spy.restore();
        analytics.track(event, properties);
        // GoSquared adds the event name to the properties hash.
        augmentedProperties = _.extend(properties, { gs_evt_name: event });
        expect(spy).to.have.been.calledWith([event, sinon.match(augmentedProperties)]);

        spy.restore();
    });


    // Pageview
    // --------

    test('calls "TrackView" on pageview', function () {
        var spy = sinon.spy(window.GoSquared.DefaultTracker, 'TrackView');
        analytics.pageview();
        expect(spy).to.have.been.called;

        spy.restore();
    });

}());
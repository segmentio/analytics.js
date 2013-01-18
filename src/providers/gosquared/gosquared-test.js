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

    test('stores settings and adds GoSquared js on initialize', function (done) {
        expect(window.GoSquared).not.to.exist;

        analytics.initialize({
            'GoSquared' : 'x'
        });
        expect(window.GoSquared).to.exist;
        expect(analytics.providers[0].settings.siteToken).to.equal('x');

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
        expect(window.GoSquared.Visitor).to.eql(traits);

        window.GoSquared.Visitor = undefined;
        analytics.identify(userId);
        expect(window.GoSquared.UserName).to.equal(userId);
        expect(window.GoSquared.Visitor).not.to.exist;

        window.GoSquared.UserName = undefined;
        analytics.identify(userId, traits);
        expect(window.GoSquared.UserName).to.equal(userId);
        expect(window.GoSquared.Visitor).to.eql(traits);
    });


    // Track
    // -----

    test('pushes "TrackEvent" on track', function () {
        var spy = sinon.spy(window.GoSquared.q, 'push');
        analytics.track(event);
        // GoSquared adds the event name to the properties hash.
        var augmentedProperties = { gs_evt_name: event };
        expect(spy.calledWith([event, sinon.match(augmentedProperties)])).to.be(true);

        spy.reset();
        analytics.track(event, properties);
        // GoSquared adds the event name to the properties hash.
        augmentedProperties = _.extend({}, properties, { gs_evt_name: event });
        expect(spy.calledWith([event, sinon.match(augmentedProperties)])).to.be(true);

        spy.restore();
    });


    // Pageview
    // --------

    test('calls "TrackView" on pageview', function () {
        var spy = sinon.spy(window.GoSquared.DefaultTracker, 'TrackView');
        analytics.pageview();
        expect(spy.called).to.be(true);

        spy.restore();
    });

}());
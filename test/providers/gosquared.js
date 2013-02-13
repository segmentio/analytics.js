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

    test('stores options and adds GoSquared js on initialize', function (done) {
        expect(window.GoSquared).to.be(undefined);

        analytics.initialize({
            'GoSquared' : 'x'
        });
        expect(window.GoSquared).not.to.be(undefined);
        expect(analytics.providers[0].options.siteToken).to.equal('x');

        window.GoSquared.load = function(tracker) {
            expect(window.GoSquared.DefaultTracker).to.equal(tracker);
            done();
        };
    });


    // Identify
    // --------

    test('correctly identifies the user', function () {
        expect(window.GoSquared.UserName).to.be(undefined);
        expect(window.GoSquared.Visitor).to.be(undefined);

        analytics.identify(traits);
        expect(window.GoSquared.UserName).to.be(undefined);
        expect(window.GoSquared.Visitor).to.eql(traits);

        window.GoSquared.Visitor = undefined;
        analytics.identify(userId);
        expect(window.GoSquared.UserName).to.equal(userId);
        expect(window.GoSquared.Visitor).to.be(undefined);

        window.GoSquared.UserName = undefined;
        analytics.identify(userId, traits);
        expect(window.GoSquared.UserName).to.equal(userId);
        expect(window.GoSquared.Visitor).to.eql(traits);
    });


    // Track
    // -----

    test('pushes "TrackEvent" on track', function () {
        var stub = sinon.stub(window.GoSquared.q, 'push');
        analytics.track(event);

        expect(stub.calledWith(["TrackEvent", event, {}])).to.be(true);

        stub.reset();
        analytics.track(event, properties);
        expect(stub.calledWith(["TrackEvent", event, properties])).to.be(true);

        stub.restore();
    });


    // Pageview
    // --------

    test('calls "TrackView" on pageview', function () {
        var stub = sinon.stub(window.GoSquared.q, 'push');

        analytics.pageview();
        expect(stub.calledWith(['TrackView', undefined])).to.be(true);

        stub.reset();

        analytics.pageview('/url');
        expect(stub.calledWith(['TrackView', '/url'])).to.be(true);

        stub.restore();
    });

}());
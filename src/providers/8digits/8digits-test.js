!(function () {

    suite('8digits');

    var event = 'event';

    var properties = {
        count : 42
    };

    var userId = null;

    var now = new Date();
    var traits = {
        name      : 'Zeus',
        firstName : 'Zeus',
        lastName  : 'Allmighty',
        username  : 'zeus98',
        email     : 'zeus@segment.io',
        avatar    : 'http://segment.io/test.png'
    };

    var aliasedTraits = {
        fullName  : 'Zeus Allmighty',
        firstName : 'Zeus',
        lastName  : 'Allmighty',
        username  : 'zeus98',
        email     : 'zeus@segment.io',
        avatar    : 'http://segment.io/test.png'
    };


    // Initialize
    // ----------

    test('stores settings and adds wm.js on initialize', function (done) {
        expect(window.mixpanel).to.be(undefined);

        analytics.initialize({
            '8digits' : 'maTrackingCode'
        });

        expect(window.WebMon).not.to.be(undefined);
        expect(analytics.providers[0].settings.trackingCode).to.equal('maTrackingCode');
        expect(window._trackingCode).not.to.be(undefined);
    });


    // Identify
    // --------

    test('calls setVisitorAttribute on identify', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        var spy = sinon.spy(window.WebMon, 'setVisitorAttribute');

        analytics.identify(traits);
        expect(spy.called).to.be(true);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWith(userId)).to.be(false);

        spy.reset();
        analytics.identify(userId, traits);
        for (var key in traits) {
            if (traits.hasOwnProperty(key)) {
                expect(spy.calledWith(key, traits[key])).to.be(true);
            }
        }

        spy.restore();
    });

    test('calls setVisitorAvatar on identify', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        var spy = sinon.spy(window.WebMon, 'setVisitorAvatar');
        analytics.identify(traits);
        expect(spy.calledWith(traits.avatar)).to.be(true);

        spy.reset();
        analytics.identify(userId);
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(traits.avatar)).to.be(true);

        spy.restore();
    });


    // Track
    // -----

    test('calls sendEvent on track', function () {
        var spy = sinon.spy(window.WebMon, 'sendEvent');
        analytics.track(event, properties);
        // Mixpanel adds custom properties, so we need to have a loose match.
        expect(spy.calledWith(event, properties.count)).to.be(true);

        spy.restore();
    });


    // Pageview
    // --------

    test('calls newPage on pageview', function () {
        var spy = sinon.spy(window.WebMon, 'newPage');
        analytics.pageview();
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.pageview('/url');
        expect(spy.calledWith('/url', true)).to.be(true);

        spy.restore();
    });

}());

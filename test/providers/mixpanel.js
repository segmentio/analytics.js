!(function () {

    suite('Mixpanel');

    var event = 'event';

    var properties = {
        count : 42
    };

    var userId = 'user';

    var now = new Date();
    var traits = {
        name      : 'Zeus',
        firstName : 'Zeus',
        lastName  : 'Allmighty',
        username  : 'zeus98',
        email     : 'zeus@segment.io',
        created   : now,
        lastSeen  : now
    };

    var aliasedTraits = {
        $name       : 'Zeus',
        $first_name : 'Zeus',
        $last_name  : 'Allmighty',
        $username   : 'zeus98',
        $email      : 'zeus@segment.io',
        $created    : now,
        $last_seen  : now
    };


    // Initialize
    // ----------

    test('stores settings and adds mixpanel.js on initialize', function (done) {
        expect(window.mixpanel).to.be(undefined);

        analytics.initialize({
            'Mixpanel' : {
                token  : 'x',
                people : true
            }
        });
        expect(window.mixpanel).not.to.be(undefined);
        expect(analytics.providers[0].settings.token).to.equal('x');
        expect(analytics.providers[0].settings.people).to.be(true);

        // test actual loading
        expect(window.mixpanel.config).to.be(undefined);
        setTimeout(function () {
            expect(window.mixpanel.config).not.to.be(undefined);
            done();
        }, 1900);
    });


    // Identify
    // --------

    test('calls identify on identify', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        var spy = sinon.spy(window.mixpanel, 'identify');
        analytics.identify(traits);
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWith(userId)).to.be(true);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(userId)).to.be(true);

        spy.restore();
    });

    test('calls register on identify', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        var spy = sinon.spy(window.mixpanel, 'register');
        analytics.identify(traits);
        expect(spy.calledWith(aliasedTraits)).to.be(true);

        spy.reset();
        analytics.identify(userId);
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(aliasedTraits)).to.be(true);

        spy.restore();
    });

    // TODO name tag with settings flag

    test('calls name_tag on identify', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        var spy = sinon.spy(window.mixpanel, 'name_tag');
        analytics.identify(traits);
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWith(userId)).to.be(true);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(traits.email)).to.be(true);

        spy.restore();
    });

    test('calls people.set on identify if `people` setting is true', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        analytics.providers[0].settings.people = true;
        var spy = sinon.spy(window.mixpanel.people, 'set');
        analytics.identify(traits);
        expect(spy.calledWith(aliasedTraits)).to.be(true);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(aliasedTraits)).to.be(true);

        spy.restore();
    });

    test('doesnt call people.set on identify if `people` setting is false', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        analytics.providers[0].settings.people = false;
        var spy = sinon.spy(window.mixpanel.people, 'set');
        analytics.identify(userId, traits);
        expect(spy.called).to.be(false);

        spy.restore();
    });


    // Track
    // -----

    test('calls track on track', function () {
        var spy = sinon.spy(window.mixpanel, 'track');
        analytics.track(event, properties);
        // Mixpanel adds custom properties, so we need to have a loose match.
        expect(spy.calledWith(event, sinon.match(properties))).to.be(true);

        spy.restore();
    });

    test('calls track_charge on track with revenue', function () {
        analytics.providers[0].settings.people = true;
        var spy = sinon.spy(window.mixpanel.people, 'track_charge');

        analytics.track(event, { revenue : 9.99 });

        expect(spy.calledWith(9.99)).to.be(true);

        spy.restore();
        analytics.providers[0].settings.people = false;
    });


    // Pageview
    // --------

    test('calls track_pageview on pageview', function () {
        var spy = sinon.spy(window.mixpanel, 'track_pageview');
        analytics.pageview();
        expect(spy.called).to.be(true);

        spy.reset();
        analytics.pageview('/url');
        expect(spy.calledWith('/url')).to.be(true);

        spy.restore();
    });


    // Alias
    // -----

    test('calls alias on alias', function () {
        var spy = sinon.spy(window.mixpanel, 'alias');
        analytics.alias('new', 'old');
        expect(spy.calledWith('new', 'old')).to.be(true);

        spy.restore();
    });

}());

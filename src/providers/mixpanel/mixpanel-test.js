/*global sinon, suite, beforeEach, test, expect, analytics */
!(function () {

    suite('Mixpanel');

    var event = 'event';

    var properties = {
        count : 42
    };

    var userId = 'user';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@segment.io'
    };

    var aliasedTraits = {
        $name  : 'Zeus',
        $email : 'zeus@segment.io'
    };


    // Initialize
    // ----------

    test('stores settings and adds mixpanel.js on initialize', function () {
        expect(window.mixpanel).not.to.exist;

        analytics.initialize({
            'Mixpanel' : {
                token  : 'x',
                people : true
            }
        });
        expect(window.mixpanel).to.exist;
        expect(analytics.providers[0].settings.token).to.equal('x');
        expect(analytics.providers[0].settings.people).to.be.true;
    });

    test('calls init with settings on initialize');


    // Identify
    // --------

    test('calls identify on identify', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        var spy = sinon.spy(window.mixpanel, 'identify');
        analytics.identify(traits);
        expect(spy).to.have.not.been.called;

        spy.reset();
        analytics.identify(userId);
        expect(spy).to.have.been.calledWith(userId);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith(userId);

        spy.restore();
    });

    test('calls register on identify', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        var spy = sinon.spy(window.mixpanel, 'register');
        analytics.identify(traits);
        expect(spy).to.have.been.calledWith(aliasedTraits);

        spy.reset();
        analytics.identify(userId);
        expect(spy).to.have.not.been.called;

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith(aliasedTraits);

        spy.restore();
    });

    // TODO name tag with settings flag

    test('calls name_tag on identify', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        var spy = sinon.spy(window.mixpanel, 'name_tag');
        analytics.identify(traits);
        expect(spy).to.have.not.been.called;

        spy.reset();
        analytics.identify(userId);
        expect(spy).to.have.been.calledWith(userId);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith(userId);

        spy.restore();
    });

    test('calls people.set on identify if `people` setting is true', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        analytics.providers[0].settings.people = true;
        var spy = sinon.spy(window.mixpanel.people, 'set');
        analytics.identify(traits);
        expect(spy).to.have.been.calledWith(aliasedTraits);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith(aliasedTraits);

        spy.restore();
    });

    test('doesnt call people.set on identify if `people` setting is false', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        analytics.providers[0].settings.people = false;
        var spy = sinon.spy(window.mixpanel.people, 'set');
        analytics.identify(userId, traits);
        expect(spy).not.to.have.been.called;

        spy.restore();
    });


    // Track
    // -----

    test('calls track on track', function () {
        var spy = sinon.spy(window.mixpanel, 'track');
        analytics.track(event, properties);
        // Mixpanel adds custom properties, so we need to have a loose match.
        expect(spy).to.have.been.calledWith(event, sinon.match(properties));

        spy.restore();
    });


    // Pageview
    // --------

    test('calls track_pageview on pageview', function () {
        var spy = sinon.spy(window.mixpanel, 'track_pageview');
        analytics.pageview();
        expect(spy).to.have.been.called;

        spy.restore();
    });

}());
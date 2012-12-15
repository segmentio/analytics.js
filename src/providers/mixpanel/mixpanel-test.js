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

    test('stores settings and adds mixpanel.js on initialize', function () {
        expect(window.mixpanel).not.to.exist;

        var settings = {
            token  : 'x',
            people : true
        };
        analytics.initialize({ 'Mixpanel' : settings });
        expect(window.mixpanel).to.exist;
        expect(analytics.providers[0].settings).to.equal(settings);
    });

    test('calls init on initialize');

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

    test('calls track on track', function () {
        var spy = sinon.spy(window.mixpanel, 'track');
        analytics.track(event, properties);
        // Mixpanel adds custom properties, so we need to have a loose match.
        expect(spy).to.have.been.calledWith(event, sinon.match(properties));

        spy.restore();
    });

    test('calls people.identify on identify if `people` setting is true', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        analytics.providers[0].settings.people = true;
        var spy = sinon.spy(window.mixpanel.people, 'identify');
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

    test('doesnt call people.identify on identify if `people` setting is false', function () {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;

        analytics.providers[0].settings.people = false;
        var spy = sinon.spy(window.mixpanel.people, 'identify');
        analytics.identify(userId, traits);
        expect(spy).not.to.have.been.called;

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

}());
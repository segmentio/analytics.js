!(function () {

    suite('Olark');

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

    test('stores settings and adds olark.js on initialize', function () {
        expect(window.olark).not.to.exist;

        analytics.initialize({
            'Olark' : 'x'
        });
        expect(window.olark).to.exist;
        expect(analytics.providers[0].settings.siteId).to.equal('x');
    });


    // Identify
    // --------

    test('updates visitor nickname on identify with the best name', function () {
        var spy = sinon.spy(window, 'olark');
        analytics.identify({
            dogs : 1
        });
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.identify({
            email : 'zeus@segment.io'
        });

        expect(spy.calledWithMatch('api.chat.updateVisitorNickname', {
            snippet : 'zeus@segment.io'
        })).to.be(true);

        spy.reset();
        analytics.identify(traits);
        expect(spy.calledWithMatch('api.chat.updateVisitorNickname', {
            snippet : 'Zeus (zeus@segment.io)'
        })).to.be(true);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWithMatch('api.chat.updateVisitorNickname', {
            snippet : 'user'
        })).to.be(true);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith('api.chat.updateVisitorNickname', {
            snippet : 'Zeus (zeus@segment.io)'
        })).to.be(true);

        spy.restore();
    });


    // Track
    // -----

    test('logs event to operator on track if `track` setting is true', function () {
        analytics.providers[0].settings.track = true;
        var spy = sinon.spy(window, 'olark');
        analytics.track(event, properties);
        expect(spy.calledWithMatch('api.chat.sendNotificationToOperator', {
            body : 'visitor triggered "'+event+'"'
        })).to.be(true);

        spy.restore();
    });

    test('doesnt log event to operator on track if `track` setting is false', function () {
        analytics.providers[0].settings.track = false;
        var spy = sinon.spy(window, 'olark');
        analytics.track(event, properties);
        expect(spy.called).to.be(false);

        spy.restore();
    });


    // Pageview
    // --------

    test('logs event to operator on pageview if `pageview` setting is true', function () {
        analytics.providers[0].settings.pageview = true;
        var spy = sinon.spy(window, 'olark');
        analytics.pageview();
        expect(spy.calledWithMatch('api.chat.sendNotificationToOperator', {
            body : 'looking at ' + window.location.href
        })).to.be(true);

        spy.restore();
    });

    test('doesnt log event to operator on pageview if `pageview` setting is false', function () {
        analytics.providers[0].settings.pageview = false;
        var spy = sinon.spy(window, 'olark');
        analytics.pageview();
        expect(spy.called).to.be(false);

        spy.restore();
    });

}());
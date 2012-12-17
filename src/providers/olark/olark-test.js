/*global sinon, suite, beforeEach, test, expect, analytics */
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

    test('stores settings and adds olark.js on initialize', function () {
        expect(window.olark).not.to.exist;

        analytics.initialize({
            'Olark' : 'x'
        });
        expect(window.olark).to.exist;
        expect(analytics.providers[0].settings.siteId).to.equal('x');
    });

    test('updates visitor nickname on identify with the best name', function () {
        var spy = sinon.spy(window, 'olark');
        analytics.identify({
            dogs : 1
        });
        expect(spy).not.to.have.been.called;

        spy.reset();
        analytics.identify({
            email : 'zeus@segment.io'
        });
        expect(spy).to.have.been.calledWith('api.chat.updateVisitorNickname', sinon.match({
            snippet : 'zeus@segment.io'
        }));

        spy.reset();
        analytics.identify(traits);
        expect(spy).to.have.been.calledWith('api.chat.updateVisitorNickname', sinon.match({
            snippet : 'Zeus (zeus@segment.io)'
        }));

        spy.reset();
        analytics.identify(userId);
        expect(spy).to.have.been.calledWith('api.chat.updateVisitorNickname', sinon.match({
            snippet : 'user'
        }));

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith('api.chat.updateVisitorNickname', sinon.match({
            snippet : 'Zeus (zeus@segment.io)'
        }));

        spy.restore();
    });

    test('logs event to operator on track if `track` setting is true', function () {
        analytics.providers[0].settings.track = true;
        var spy = sinon.spy(window, 'olark');
        analytics.track(event, properties);
        expect(spy).to.have.been.calledWith('api.chat.sendNotificationToOperator', sinon.match({
            body : 'Visitor triggered "'+event+'".'
        }));

        spy.restore();
    });

    test('doesnt log event to operator on track if `track` setting is false', function () {
        analytics.providers[0].settings.track = false;
        var spy = sinon.spy(window, 'olark');
        analytics.track(event, properties);
        expect(spy).not.to.have.been.called;

        spy.restore();
    });

}());
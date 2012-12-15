/*global sinon, suite, beforeEach, test, expect, analytics */
!(function () {

    suite('KISSmetrics');

    var event = 'event';

    var properties = {
        count : 42
    };

    var userId = 'user';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@segment.io'
    };

    test('stores settings and adds kissmetrics javascript on initialize', function () {
        expect(window._kmq).not.to.exist;

        analytics.initialize({
            'KISSmetrics' : 'x'
        });
        expect(window._kmq).to.exist;
    });

    test('pushes "_identify" on identify', function () {
        var spy = sinon.spy(window._kmq, 'push');
        analytics.identify(traits);
        expect(spy).to.have.not.been.calledWith(['identify', userId]);

        spy.reset();
        analytics.identify(userId);
        expect(spy).to.have.been.calledWith(['identify', userId]);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith(['identify', userId]);

        spy.restore();
    });

    test('pushes "_set" on identify', function () {
        var spy = sinon.spy(window._kmq, 'push');
        analytics.identify(traits);
        expect(spy).to.have.been.calledWith(['set', traits]);

        spy.reset();
        analytics.identify(userId);
        expect(spy).to.have.not.been.calledWith(['set', traits]);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith(['set', traits]);

        spy.restore();
    });

    test('pushes "_record" on track', function () {
        var spy = sinon.spy(window._kmq, 'push');
        analytics.track(event, properties);
        expect(spy).to.have.been.calledWith(['record', event, properties]);

        spy.restore();
    });

}());
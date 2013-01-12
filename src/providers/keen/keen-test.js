/*global sinon, suite, beforeEach, test, expect, analytics */
!(function() {

    suite('Keen');

    var event = 'event';

    var properties = {
        count: 42
    };

    var userId = 'user';

    var traits = {
        name: 'Zeus',
        email: 'zeus@segment.io'
    };
    
    // Initialize
    // ----------
    test('stores settings and adds keenio.js on initialize', function() {
        expect(window.Keen).not.to.exist;

        analytics.initialize({
            'Keen': {
                projectId: '4f4dc223163d6667f7000000',
                apiKey: '26975cb8a7db41d1a65a7264a0f04991'
            }
        });
        expect(window.Keen).to.exist;
        expect(window.Keen.setGlobalProperties).to.exist;
        expect(window.Keen.addEvent).to.exist;
        expect(window.Keen._pId).to.equal('4f4dc223163d6667f7000000');
        expect(window.Keen._ak).to.equal('26975cb8a7db41d1a65a7264a0f04991');
    });

    // Identify
    // --------
    test('calls setGlobalProperties on identify', function() {
        // Reset internal `userId` state from any previous identifies.
        analytics.userId = null;
        
        var spy = sinon.spy(window.Keen, 'setGlobalProperties');
        analytics.identify();
        expect(spy).to.have.not.been.called;

        spy.reset();
        analytics.identify(userId);
        expect(spy).to.have.been.called;

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.called;

        spy.restore();
    });

    // Track
    // -----
    test('calls addEvent on track', function() {
        var spy = sinon.spy(window.Keen, 'addEvent');
        analytics.track(event, properties);
        // Keen IO adds custom properties, so we need to have a loose match.
        expect(spy).to.have.been.calledWith(event, sinon.match(properties));

        spy.restore();
    });

}());

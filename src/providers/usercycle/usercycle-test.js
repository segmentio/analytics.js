!(function () {

    suite('USERcycle');

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

    test('stores settings and adds mixpanel.js on initialize', function () {
        expect(window._uc).not.to.exist;

        analytics.initialize({
            'USERcycle' : {
                key : 'x'
            }
        });
        expect(window._uc).to.exist;
        expect(analytics.providers[0].settings.key).to.equal('x');
    });

    test('calls init with settings on initialize');


    // Identify
    // --------

    test('calls identify on identify', function () {
        var spy = sinon.spy(window._uc, 'push');
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith(['uid', userId, sinon.match(traits)]);

        spy.restore();
    });


    // Track
    // -----

    test('calls track on track', function () {
        var spy = sinon.spy(window._uc, 'push');
        analytics.track(event, properties);
        expect(spy).to.have.been.calledWith(['action', event, sinon.match(properties)]);

        spy.restore();
    });

}());
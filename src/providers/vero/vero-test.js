!(function () {

    suite('Vero');

    var event = 'event';

    var properties = {
        count : 42
    };

    var userId = 'user';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@olympus.io'
    };


    // Initialize
    // ----------

    test('adds Vero\'s m.js on initialize', function () {
        expect(window._veroq).not.to.exist;

        analytics.initialize({
            'Vero' : 'x'
        });
        expect(window._veroq).to.exist;
        expect(analytics.providers[0].settings.apiKey).to.equal('x');
    });


    // Identify
    // --------

    test('pushes "users" on identify', function () {
        var spy = sinon.spy(window._veroq, 'push');
        analytics.identify(traits);
        expect(spy).to.not.have.been.called;

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith([
            'user',
            {
                id         : userId,
                email      : traits.email,
                name       : traits.name
            }
        ]);

        spy.restore();
    });


    // Track
    // -----

    test('pushes "track" on track', function () {
        var spy = sinon.spy(window._veroq, 'push');
        analytics.track('event', properties);
        expect(spy).to.have.been.calledWith(['track', 'event', properties]);

        spy.restore();
    });

}());
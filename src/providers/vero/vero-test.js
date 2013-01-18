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

    test('adds Vero\'s m.js on initialize', function (done) {
        expect(window._veroq).not.to.exist;

        analytics.initialize({
            'Vero' : 'x'
        });
        expect(window._veroq).to.exist;
        expect(window._veroq.push).to.equal(Array.prototype.push);
        expect(analytics.providers[0].settings.apiKey).to.equal('x');

        setTimeout(function () {
          // Check that vero has indeed loaded
          expect(window._veroq.push).not.to.equal(Array.prototype.push);
          done();
        }, 1000);
    });


    // Identify
    // --------

    // Very requires an email and traits. Check for both separately, but do
    // traits first because otherwise the userId will be cached.
    test('pushes "users" on identify', function () {
        var spy = sinon.spy(window._veroq, 'push');
        analytics.identify(traits);
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.identify(userId);
        expect(spy.called).to.be(false);

        spy.reset();
        // Vero alters passed in array, use with args to track count
        spy.withArgs(['user', {
            id    : userId,
            email : traits.email,
            name  : traits.name
        }]);

        analytics.identify(userId, traits);
        expect(spy.calledOnce).to.be(true);

        spy.restore();
    });


    // Track
    // -----

    test('pushes "track" on track', function () {
        var spy = sinon.spy(window._veroq, 'push');
        analytics.track('event', properties);

        spy.withArgs(['track', 'event', properties]);

        expect(spy.called).to.be(true);

        spy.restore();
    });

}());
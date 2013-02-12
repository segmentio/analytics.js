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
        expect(window._veroq).to.be(undefined);

        analytics.initialize({
            'Vero' : 'x'
        });
        expect(window._veroq).not.to.be(undefined);
        expect(window._veroq.push).to.equal(Array.prototype.push);
        expect(analytics.providers[0].settings.apiKey).to.equal('x');

        setTimeout(function () {
          // Check that vero has indeed loaded
          expect(window._veroq.push).not.to.equal(Array.prototype.push);
          done();
        }, 1900);
    });


    // Identify
    // --------

    // Very requires an email and traits. Check for both separately, but do
    // traits first because otherwise the userId will be cached.
    test('pushes "users" on identify', function () {

        // Vero alters passed in array, use a stub to track count
        var stub = sinon.stub(window._veroq, 'push');
        analytics.identify(traits);
        expect(stub.called).to.be(false);

        stub.reset();
        analytics.identify(userId);
        expect(stub.called).to.be(false);

        stub.reset();

        analytics.identify(userId, traits);
        expect(stub.calledWith(['user', {
            id    : userId,
            email : traits.email,
            name  : traits.name
        }])).to.be(true);

        stub.restore();
    });


    // Track
    // -----

    test('pushes "track" on track', function () {
        var stub = sinon.stub(window._veroq, 'push');
        analytics.track('event', properties);

        expect(stub.calledWith(['track', 'event', properties])).to.be(true);

        stub.restore();
    });

}());
!(function () {

    suite('Storyberg');

    var event = 'key';

    var userId = 'user';

    var traits = {
        name    : 'Stanley',
        email   : 'stanley@storyberg.com'
    };


    // Initialize
    // ----------

    test('adds Storyberg\'s analytics.js on initialize', function (done) {
        expect(window._sbq).to.be(undefined);

        analytics.initialize({
            'Storyberg' : 'a'
        });
        expect(window._sbq).not.to.be(undefined);
        expect(window._sbq.push).to.equal(Array.prototype.push);
        expect(analytics.providers[0].settings.apiKey).to.equal('a');

        setTimeout(function () {
            // Check that Storyberg has indeed loaded
            expect(window._sbq.push).not.to.equal(Array.prototype.push);
            done();
        }, 1900);
    });

    // Identify
    // --------

    test('pushes "identify" on identify', function () {
        var stub = sinon.stub(window._sbq, 'push');
        analytics.identify(traits);
        expect(stub.calledWith(['identify', {user_id: traits.user_id}])).to.be(false);

        stub.reset();
        analytics.identify(userId);
        expect(stub.calledWith(['identify', {user_id: userId}])).to.be(true);

        stub.reset();
        analytics.identify(userId, traits);
        expect(stub.calledWith(['identify', {
            user_id: userId,
            name: traits.name,
            email: traits.email
        }])).to.be(true);

        stub.restore();
    });

    // Track
    // -----

    test('pushes "event" on track', function () {
        var stub = sinon.stub(window._sbq, 'push');
        analytics.track(event, {user_id: userId});

        expect(stub.calledWith(['event', {name: event, user_id: userId}])).to.be(true);

        stub.restore();
    });
}());

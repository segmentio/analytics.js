!(function () {

    suite('Customer.io');

    var event = 'event';

    var properties = {
        count : 42
    };

    var userId = 'user';

    var traits = {
        name    : 'Zeus',
        created : new Date('12/30/1989')
    };


    // Initialize
    // ----------

    test('adds customer.io\'s track.js on initialize', function (done) {
        expect(window._cio).to.be(undefined);

        analytics.initialize({
            'Customer.io' : 'x'
        });
        expect(window._cio).not.to.be(undefined);
        expect(analytics.providers[0].settings.siteId).to.equal('x');

        // test actual loading
        expect(window._cio.image).to.be(undefined);
        setTimeout(function () {
            expect(window._cio.image).not.to.be(undefined);
            done();
        }, 1900);
    });


    // Identify
    // --------

    test('calls identify on identify', function () {
        var spy = sinon.spy(window._cio, 'identify');
        analytics.identify(traits);
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith({
            id         : userId,
            name       : traits.name,
            created_at : Math.floor((new Date('12/30/1989')).getTime() / 1000)
        })).to.be(true);

        spy.restore();
    });


    // Track
    // -----

    test('calls track on track', function () {
        var spy = sinon.spy(window._cio, 'track');
        analytics.track(event, properties);
        expect(spy.calledWith(event, properties)).to.be(true);

        spy.restore();
    });

}());
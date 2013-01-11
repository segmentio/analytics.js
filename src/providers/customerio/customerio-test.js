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

    test('adds customer.io\'s track.js on initialize', function () {
        expect(window._cio).not.to.exist;

        analytics.initialize({
            'Customer.io' : 'x'
        });
        expect(window._cio).to.exist;
        expect(analytics.providers[0].settings.siteId).to.equal('x');
    });


    // Identify
    // --------

    test('calls identify on identify', function () {
        var spy = sinon.spy(window._cio, 'identify');
        analytics.identify(traits);
        expect(spy).to.not.have.been.called;

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith({
            id         : userId,
            name       : traits.name,
            created_at : Math.floor((new Date('12/30/1989')).getTime() / 1000)
        });

        spy.restore();
    });


    // Track
    // -----

    test('calls track on track', function () {
        var spy = sinon.spy(window._cio, 'track');
        analytics.track(event, properties);
        expect(spy).to.have.been.calledWith(event, properties);

        spy.restore();
    });

}());
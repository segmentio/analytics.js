!(function () {

    suite('Customer.io');

    var options = {
        'Customer.io' : 'x'
    };

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

    // Customer.io can't be loaded twice, so we do all this in one test.
    test('loads library and calls ready on initialize', function (done) {
        expect(window._cio).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);
        expect(analytics.providers[0].options.siteId).to.equal('x');
        expect(window._cio).not.to.be(undefined);
        expect(window._cio.pageHasLoaded).to.be(undefined);
        expect(spy.called).to.be(true);

        // When the library is actually loaded `pageHasLoaded` is set.
        setTimeout(function () {
            expect(window._cio.pageHasLoaded).not.to.be(undefined);
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
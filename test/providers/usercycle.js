!(function () {

    suite('USERcycle');

    var options = { 'USERcycle' : 'x' };

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

    test('calls ready and loads the library on initialize', function () {
        expect(window._uc).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);
        expect(window._uc).not.to.be(undefined);
        expect(spy.called).to.be(true);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.key).to.equal('x');
    });


    // Identify
    // --------

    test('calls identify on identify', function () {
        var spy = sinon.spy(window._uc, 'push');
        analytics.identify(userId, traits);
        expect(spy.calledWith(['uid', userId, sinon.match(traits)])).to.be(true);

        spy.restore();
    });


    // Track
    // -----

    test('calls track on track', function () {
        var spy = sinon.spy(window._uc, 'push');
        analytics.track(event, properties);
        expect(spy.calledWith(['action', event, sinon.match(properties)])).to.be(true);

        spy.restore();
    });

}());
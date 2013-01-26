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

    test('stores settings and adds USERcycles js on initialize', function () {
        expect(window._uc).to.be(undefined);

        analytics.initialize({ 'USERcycle' : 'x' });

        expect(window._uc).not.to.be(undefined);
        expect(analytics.providers[0].settings.key).to.equal('x');
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
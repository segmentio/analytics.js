!(function () {

    suite('KISSmetrics');

    var options = { 'KISSmetrics' : 'x' };

    var event = 'event';

    var properties = {
        count   : 42,
        revenue : 9.99
    };

    var userId = 'user';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@segment.io'
    };


    // Initialize
    // ----------

    test('calls ready and loads library on initialize', function () {
        expect(window._kmq).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize({ 'KISSmetrics' : 'x' });
        expect(spy.called).to.be(true);
        expect(window._kmq).not.to.be(undefined);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.apiKey).to.equal('x');
    });


    // Identify
    // --------

    test('pushes "_identify" on identify', function () {
        var spy = sinon.spy(window._kmq, 'push');
        analytics.identify(traits);
        expect(spy.calledWith(['identify', userId])).to.be(false);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWith(['identify', userId])).to.be(true);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(['identify', userId])).to.be(true);

        spy.restore();
    });

    test('pushes "_set" on identify', function () {
        var spy = sinon.spy(window._kmq, 'push');
        analytics.identify(traits);
        expect(spy.calledWith(['set', traits])).to.be(true);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWith(['set', traits])).to.be(false);
        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(['set', traits])).to.be(true);

        spy.restore();
    });


    // Track
    // -----

    test('pushes "_record" on track', function () {
        var spy = sinon.spy(window._kmq, 'push');
        analytics.track(event, properties);
        expect(spy.calledWith(['record', event, {
            count            : 42,
            'Billing Amount' : 9.99
        }])).to.be(true);

        spy.restore();
    });


    // Alias
    // -----

    test('calls alias on alias', function () {
        var spy = sinon.spy(window._kmq, 'push');
        analytics.alias('new', 'old');
        expect(spy.calledWith(['alias', 'new', 'old'])).to.be(true);

        spy.restore();
    });

}());
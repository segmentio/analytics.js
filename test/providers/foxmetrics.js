!(function () {

    suite('FoxMetrics');

    var event = 'segment.io test';

    var userId = '99FG84yf';

    var traits = {
        name: 'John Fox',
        email: 'john.fox@foxmetrics.com'
    };

    var properties = {
        domain: 'segment.io'
    };

    // Initialize
    // ----------

    test('adds foxmetrics tracking script on initialize', function () {
        expect(window._fxm).to.be(undefined);

        analytics.initialize({
            'FoxMetrics': '4ec10e0c1542321b8c4caae7'
        });

        expect(window._fxm).not.to.be(undefined);
        expect(analytics.providers[0].settings.appId).to.equal('4ec10e0c1542321b8c4caae7');
    });

    // Identify
    // --------

    test('calls [fxm.visitor.Profile] on identify', function () {
        var spy = sinon.spy(window._fxm, 'push');
        analytics.identify(traits);
        expect(spy.called).to.be(false);

        spy.reset();
        analytics.identify(userId);
        expect(spy.calledWith(['_fxm.visitor.Profile', userId, null, null, null, null, null, null, null])).to.be(true);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy.calledWith(['_fxm.visitor.Profile', userId, 'John', 'Fox', traits.email, null, null, null, traits])).to.be(true);

        spy.restore();
    });

    // Track
    // -----

    test('calls custom event on track', function () {
        var spy = sinon.spy(window._fxm, 'push');
        analytics.track(event, properties);
        expect(spy.calledWith([event, null, properties])).to.be(true);

        spy.restore();
    });

    // Pageview
    // --------

    test('calls [fxm.pages.view] on pageview', function () {
        var spy = sinon.spy(window._fxm, 'push');
        analytics.pageview();
        expect(spy.calledWith(['_fxm.pages.view', null, null, null, null, null])).to.be(true);

        spy.reset();
        analytics.pageview('/url');
        expect(spy.calledWith(['_fxm.pages.view', null, null, null, '/url', null])).to.be(true);

        spy.restore();
    });

} ());
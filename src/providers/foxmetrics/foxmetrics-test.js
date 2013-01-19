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
        expect(window._fxm).not.to.exist;

        analytics.initialize({
            'FoxMetrics': '4ec10e0c1542321b8c4caae7'
        });

        expect(window._fxm).to.exist;
        expect(analytics.providers[0].settings.appId).to.equal('4ec10e0c1542321b8c4caae7');
    });

    // Identify
    // --------

    test('calls [fxm.visitor.Profile] on identify', function () {
        var spy = sinon.spy(window._fxm, 'push');
        analytics.identify(traits);
        expect(spy).to.have.not.been.called;

        spy.reset();
        analytics.identify(userId);
        expect(spy).to.have.been.calledWith(['_fxm.visitor.Profile', userId, null, null, null, null, null, null, null]);

        spy.reset();
        analytics.identify(userId, traits);
        expect(spy).to.have.been.calledWith(['_fxm.visitor.Profile', userId, 'John', 'Fox', traits.email, null, null, null, traits]);

        spy.restore();
    });

    // Track
    // -----

    test('calls custom event on track', function () {
        var spy = sinon.spy(window._fxm, 'push');
        analytics.track(event, properties);
        expect(spy).to.have.been.calledWith([event, null, properties]);

        spy.restore();
    });

    // Pageview
    // --------

    test('calls [fxm.pages.view] on pageview', function () {
        var spy = sinon.spy(window._fxm, 'push');
        analytics.pageview();
        expect(spy).to.have.been.calledWith(['_fxm.pages.view', null, null, null, null, null]);        

        spy.reset();
        analytics.pageview('/url');
        expect(spy).to.have.been.calledWith(['_fxm.pages.view', null, null, null, '/url', null]);

        spy.restore();
    });

} ());
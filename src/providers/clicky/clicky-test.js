!(function () {

    suite('Clicky');

    var event = 'event';

    var properties = {
        count : 42
    };


    // Initialize
    // ----------

    // Clicky loads very slowly on travis, so we get smart and check it on an
    // interval so that we wait for the shortest time possible.
    test('stores settings and adds clicky.js on initialize', function (done) {
        this.timeout(10000);

        expect(window.clicky).not.to.exist;

        analytics.initialize({
            'Clicky' : 'x'
        });

        var interval = setInterval(function () {
            if (window.clicky) {
                clearInterval(interval);
                expect(window.clicky).to.exist;
                done();
            }
        }, 1000);

        expect(analytics.providers[0].settings.siteId).to.equal('x');
    });


    // Track
    // -----

    test('calls log on track', function () {
        var spy = sinon.spy(window.clicky, 'log');
        analytics.track(event, properties);
        // Mixpanel adds custom properties, so we need to have a loose match.
        expect(spy).to.have.been.calledWith(window.location.href, event);

        spy.restore();
    });


    // Pageview
    // --------

    test('sends pageview on pageview');

}());
!(function () {

    suite('Clicky');

    var options = {
        'Clicky' : 'x'
    };

    var event = 'event';

    var properties = {
        count : 42
    };


    // Initialize
    // ----------

    // Clicky loads very slowly on travis, so we get smart and check it on an
    // interval so that we wait for the shortest time possible.
    test('calls ready loads adds clicky.js on initialize', function (done) {
        this.timeout(10000);
        expect(window.clicky).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);
        var interval = setInterval(function () {
            if (window.clicky) {
                clearInterval(interval);
                expect(window.clicky).not.to.be(undefined);
                expect(spy.called).to.be(true);
                done();
            }
        }, 1900);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.siteId).to.equal('x');
    });



    // Track
    // -----

    test('calls log on track', function () {
        var spy = sinon.spy(window.clicky, 'log');
        analytics.track(event, properties);
        expect(spy.calledWith(window.location.href, event)).to.be(true);

        spy.restore();
    });

}());
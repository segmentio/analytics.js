!(function () {

    suite('Intercom');

    var options = {
        'Intercom' : 'x'
    };

    // Initialize
    // ----------

    test('calls ready on initialize', function () {
        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);
        expect(spy.called).to.be(true);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.appId).to.equal('x');
    });


    // Identify
    // --------

    test('adds intercom javascript on identify', function () {
        expect(window.intercomSettings).to.be(undefined);

        analytics.identify('zeus@segment.io', { name : 'Zeus' });
        expect(window.intercomSettings).not.to.be(undefined);
    });

    test('doesnt do anything on identifying twice', function () {
        // We're going to test that `window.intercomSettings` doesnt get reset
        // to identified values again.
        window.intercomSettings = undefined;

        analytics.identify('zeus@segment.io', { name : 'Zeus' });
        expect(window.intercomSettings).to.be(undefined);
    });

}());
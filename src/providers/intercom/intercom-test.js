!(function () {

    suite('Intercom');


    // Initialize
    // ----------

    test('stores settings on initialize', function () {
        analytics.initialize({
            'Intercom' : 'x'
        });
        expect(analytics.providers[0].settings.appId).to.equal('x');
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
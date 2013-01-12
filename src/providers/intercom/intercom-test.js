!(function () {

    suite('Intercom');

    test('stores settings on initialize', function () {
        analytics.initialize({
            'Intercom' : 'x'
        });
        expect(analytics.providers[0].settings.appId).to.equal('x');
    });

    test('adds intercom javascript on identify', function () {
        expect(window.intercomSettings).not.to.exist;

        analytics.identify('zeus@segment.io', { name : 'Zeus' });
        expect(window.intercomSettings).to.exist;
    });

}());
!(function () {

    suite('SnapEngage');

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

    test('stores settings and adds SnapEngage on initialize', function () {
        expect(window.SnapABug).not.to.exist;

        analytics.initialize({ 'SnapEngage' : 'x' });

        expect(analytics.providers[0].settings.apiKey).to.equal('x');
    });

}());
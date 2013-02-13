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

    test('stores options and adds SnapEngage on initialize', function () {
        expect(window.SnapABug).to.be(undefined);

        analytics.initialize({ 'SnapEngage' : 'x' });

        expect(analytics.providers[0].options.apiKey).to.equal('x');
    });

}());
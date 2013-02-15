!(function () {

    suite('SnapEngage');

    var options = { 'SnapEngage' : '782b737e-487f-4117-8a2b-2beb32b600e5' };

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

    test('stores options and adds SnapEngage on initialize', function (done) {
        expect(window.SnapABug).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);

        setTimeout(function () {
            expect(window.SnapABug).not.to.be(undefined);
            expect(spy.called).to.be(true);
            done();
        }, 1900);
    });

    test('stores options on initialize', function () {
        analytics.initialize(options);
        expect(analytics.providers[0].options.apiKey).to.equal('782b737e-487f-4117-8a2b-2beb32b600e5');
    });

}());
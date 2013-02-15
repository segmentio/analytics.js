!(function () {

    suite('Errorception');

    var options = { 'Errorception' : 'x' };

    var userId = 'user';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@segment.io'
    };


    // Initialize
    // ----------

    test('stores options and adds errorception.js on initialize', function () {
        expect(window._errs).to.be(undefined);

        var spy = sinon.spy();
        analytics.ready(spy);
        analytics.initialize(options);

        expect(window._errs).not.to.be(undefined);
        expect(analytics.providers[0].options.projectId).to.equal('x');
        expect(spy.called).to.be(true);
    });


    // Identify
    // --------

    test('adds metadata on identify if `meta` setting is true', function () {
        expect(window._errs.meta).to.be(undefined);

        analytics.providers[0].options.meta = true;
        analytics.identify(userId, traits);

        expect(window._errs.meta).to.eql(traits);
    });

    test('doesnt add metadata on identify if `meta` setting is false', function () {
        window._errs.meta = undefined;

        analytics.providers[0].options.meta = false;
        analytics.identify(userId, traits);

        expect(window._errs.meta).to.be(undefined);
    });

}());
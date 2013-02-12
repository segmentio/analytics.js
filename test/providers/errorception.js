!(function () {

    suite('Errorception');

    var userId = 'user';

    var traits = {
        name  : 'Zeus',
        email : 'zeus@segment.io'
    };


    // Initialize
    // ----------

    test('stores settings and adds errorception.js on initialize', function () {
        expect(window._errs).to.be(undefined);

        analytics.initialize({ 'Errorception' : 'x' });

        expect(window._errs).not.to.be(undefined);
        expect(analytics.providers[0].settings.projectId).to.equal('x');
    });


    // Identify
    // --------

    test('adds metadata on identify if `meta` setting is true', function () {
        expect(window._errs.meta).to.be(undefined);

        analytics.providers[0].settings.meta = true;
        analytics.identify(userId, traits);

        expect(window._errs.meta).to.eql(traits);
    });

    test('doesnt add metadata on identify if `meta` setting is false', function () {
        window._errs.meta = undefined;

        analytics.providers[0].settings.meta = false;
        analytics.identify(userId, traits);

        expect(window._errs.meta).to.eql({});
    });

}());
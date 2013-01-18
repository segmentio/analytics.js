!(function () {

    suite('HitTail');


    // Initialize
    // ----------

    test('stores settings and adds mlt.js on initialize', function (done) {
        expect(window.htk).not.to.exist;

        analytics.initialize({
            'HitTail' : 'x'
        });

        // We have to wait for the mlt.js to come back and create the
        // global variable on window...
        var self = this;
        setTimeout(function () {
        expect(window.htk).to.exist;
        expect(analytics.providers[0].settings.siteId).to.equal('x');
            done();
        }, 500);
    });

}());
